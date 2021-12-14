from typing import List, Optional
from fastapi import FastAPI, WebSocket, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.param_functions import Body
from pydantic import BaseModel
import sqlalchemy
from sqlalchemy.ext.asyncio import create_async_engine, result
from sqlalchemy.sql.expression import text, true
from datetime import datetime

app = FastAPI(openapi_url='/')

origins = [
	'http://localhost:8000',
	'http://localhost',
	'*'
]

engine = create_async_engine('postgresql+asyncpg://postgres:secret@localhost:5432/')

class TodoModel(BaseModel):
	pk: Optional[int]
	content: Optional[str]
	content_image: Optional[str]
	created_at: Optional[datetime]

app.add_middleware(
	CORSMiddleware,
	allow_origins=origins,
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"]
)

@app.get('/todos', response_model=List[TodoModel])
async def get_todo(pk: List[int] = Query(None)) -> List[TodoModel]:
	async with engine.begin() as conn:
		if pk:
			res = await conn.execute(text('SELECT * FROM todos  WHERE pk = ANY(:pk)'), {'pk': pk})
		else:
			res = await conn.execute(text('SELECT * FROM todos'))
		res = [TodoModel(**dict(r)) for r in res.fetchall()]
		return res

@app.delete('/todos', response_model=int)
async def delete_todo(pk: int) -> int:
	async with engine.begin() as conn:
		res = await conn.execute(text("""
			DELETE FROM private.todos WHERE pk = :pk;
		"""), {'pk': pk})
	return pk

@app.post('/todos', response_model=int)
async def post_todo(todo: TodoModel) -> int:
	async with engine.begin() as conn:
		res = await conn.execute(
			text("""
				INSERT INTO private.todos (content, content_image)
				VALUES (:content, :content_image)
				RETURNING pk;
			"""), {'content': todo.content, 'content_image': todo.content_image}
		)
	return res.fetchone()[0]

@app.patch('/todos', response_model=int)
async def patch_todo(pk: int, todo: TodoModel) -> int:
	async with engine.begin() as conn:
		res = await conn.execute(
			text(
				"""
					UPDATE private.todos SET
						content = :content,
						created_at = NOW()
					WHERE 
						pk = :pk
				"""
			), {'content': todo.content,  'pk': pk})
		return pk