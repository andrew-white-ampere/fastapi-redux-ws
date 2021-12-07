import React, { useCallback } from "react";
import { useGetEditFormState, useSetEditFormState, useGetTodo } from "../hooks/todos";
import { useDispatchHideTodoImage, useDispatchShowTodoImage } from "../hooks/todoImage";
import TodoDeleteButton from "./TodoDeleteButton";
import TodoEditForm from "./TodoEditForm";
import { makeStyles } from '@material-ui/core/styles';
import logo from "../images/logo.svg";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


export default function TodoListItem({
  pk,
  job_name,
  job_class_string,
  created_at,
  todo_idx,
  todo_pk
}) {
  const editFormState = useGetEditFormState();
  const setEditFormState = useSetEditFormState();
  const isEditing = editFormState.pk === pk;
  const onContentClick = useCallback(
    () => setEditFormState({ pk, job_name }),
    [setEditFormState, pk, job_name]
  );
  const dispatchHideTodoImage = useDispatchHideTodoImage(todo_idx);

  const dispatchGetAction = useGetTodo();

  return (
    <TableRow key={todo_pk}>
              <TableCell component="th" scope="row">
                {pk}
              </TableCell>
              <TableCell align="right"> {job_class_string}</TableCell>
              <TableCell align="left">{created_at}</TableCell>
              <TableCell align="right">{todo_idx}</TableCell>
              <TableCell align="right"></TableCell>
              <button onClick={() => dispatchGetAction(pk)}>refresh</button>
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
