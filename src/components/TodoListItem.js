import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TodoEditForm from "./TodoEditForm";
import { makeReduxApiHooks } from "../redux-api/main";
import { toggleIsEditing } from "../store";
import { hasPath } from 'ramda';

export default function TodoListItem({
  pk,
  content,
  created_at,
  todo_idx,
}) {
  const { useDispatchDelete } = makeReduxApiHooks('todos');
  const dispatchDeleteTodos = useDispatchDelete();
  const dispatch = useDispatch();
  const isEditing = useSelector((state) => state.editTodo.isEditing);

  return (
    <TableRow key={pk}>
              <TableCell component="th" scope="row">
                {pk}
              </TableCell>
              {( (pk in isEditing) && isEditing[pk]) ? (
                  <TodoEditForm pk={pk} />
                ) : (
                  <TableCell onClick={() => dispatch(toggleIsEditing(pk))}>{content}</TableCell>
                )}
              <TableCell align="right"> {(pk in isEditing) ? `${isEditing[pk]}` : 'FALSE' }</TableCell>
              <TableCell align="left">{created_at}</TableCell>
              <TableCell align="right">{todo_idx}</TableCell>
              <TableCell align="right"></TableCell>
              <TableCell onClick={() => dispatch(dispatchDeleteTodos(pk))}>delete</TableCell>
    </TableRow>
  );
}
