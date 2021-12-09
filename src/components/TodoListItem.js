import React, { useCallback } from "react";
import { useGetEditFormState, useSetEditFormState, useDispatchEditTodo, useDispatchDeleteTodo } from "../hooks/todos";
import { useDispatchHideTodoImage } from "../hooks/todoImage";
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TodoEditForm from "./TodoEditForm";


export default function TodoListItem({
  pk,
  content,
  created_at,
  todo_idx,
  todo_pk
}) {
  const editFormState = useGetEditFormState();
  const setEditFormState = useSetEditFormState();
  const isEditing = editFormState.pk === pk;
  const onContentClick = useCallback(
    () => setEditFormState({ pk, content }),
    [setEditFormState, pk, content]
  );
  const dispatchDelete = useDispatchDeleteTodo();

  return (
    <TableRow key={todo_pk}>
              <TableCell component="th" scope="row">
                {pk}
              </TableCell>
              {isEditing ? (
                  <TodoEditForm pk={pk} />
                ) : (
                  <TableCell onClick={() => onContentClick()}>{content}</TableCell>
                )}
              <TableCell align="right"> {content}</TableCell>
              <TableCell align="left">{created_at}</TableCell>
              <TableCell align="right">{todo_idx}</TableCell>
              <TableCell align="right"></TableCell>
              <TableCell onClick={() => dispatchDelete(pk)}>delete</TableCell>
    </TableRow>
  );
}

function TodoImage(content_image) {
  return (
    <img
      className="todo-image"
      alt="uploaded with the todo"
      src={`data:*/*;base64,${content_image}`}
    />
  );
}

function TodoDate({ date }) {
  return <span className="todo-date">{new Date(date).toLocaleString()}</span>;
}
