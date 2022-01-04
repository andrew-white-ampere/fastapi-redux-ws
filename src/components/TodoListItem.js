import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TodoEditForm from "./TodoEditForm";
import { makeReduxApiHooks } from "../redux-api/main";
import { toggleIsEditing } from "../slices/editTodo";
import { path } from 'ramda';

export default function TodoListItem({
  pk,
  content,
  created_at,
  todo_idx,
}) {
  const { useDispatchDelete } = makeReduxApiHooks('todos');
  const dispatchDeleteTodos = useDispatchDelete();
  const dispatch = useDispatch();
  const editTodo = useSelector(path(["editTodo"]));

  return (
    <TableRow key={pk}>
              <TableCell component="th" scope="row">
                {pk}
              </TableCell>
              {( (pk in editTodo) && editTodo[pk]["isEditing"]) ? (
                  <TodoEditForm pk={pk} />
                ) : (
                  <TableCell onClick={() => dispatch(toggleIsEditing(pk))}>{content}</TableCell>
                )}
              <TableCell align="left">{created_at}</TableCell>
              <TableCell align="right">{todo_idx}</TableCell>
              <TableCell align="right"></TableCell>
              <TableCell onClick={() => dispatchDeleteTodos(pk)}>delete</TableCell>
    </TableRow>
  );
}
