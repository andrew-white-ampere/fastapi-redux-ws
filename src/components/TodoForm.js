import { Button } from "@material-ui/core";
import React from "react";
import { useCreateTodo } from "../hooks/todos";
import { makeReduxApiHooks } from "../redux-api/main";

export default function TodoForm() {
  const { content, setContent, setImageContent, submitTodo } = useCreateTodo();
  const { useDispatchGet } = makeReduxApiHooks("todos");
  const dispatch = useDispatchGet();
  return (
    <form
      type=""
      onSubmit={e => {
        e.preventDefault();
        submitTodo();
      }}
    >
      <Button onClick={()=>{dispatch()}}>GET</Button>
      <div>
        <input
          placeholder="I need to..."
          type="text"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <input value="＋" type="submit" />
      </div>
      <div>
        <input type="file" onChange={e => setImageContent(e.target.files)} />
      </div>
    </form>
  );
}
