import React from "react";
import { useGetEditFormState, useDispatchEditTodo, useSetEditFormState } from "../hooks/todos";
import { makeReduxApiHooks } from "../redux-api/main";
import { useDispatch, useSelector } from "react-redux";
import { path } from "ramda";
import { toggleIsEditing, setEditTodoState } from "../store";

export default function TodoEditForm({ pk }) {
  const setEditFormState = useSetEditFormState()
  //const editFormState = useGetEditFormState()
  const submitTodo = useDispatchEditTodo()
  const { useDispatchPatch, useDispatchGet } = makeReduxApiHooks('todos');
  const dispatchTodoPatch = useDispatchPatch();
  const dispatchTodoGet = useDispatchGet();
  const dispatch = useDispatch();
  const editFormState = useSelector(path(["editTodo", pk])); 
  
  return (
    <td>
      <input
        type="text"
        onChange={e => dispatch(setEditTodoState({ pk: pk, content: e.target.value }))}
        value={editFormState.content}
      />
      <button onClick={()=>{dispatchTodoPatch({pk: pk}, {content: editFormState.content}); dispatch(toggleIsEditing(pk)); dispatchTodoGet({pk: pk})}}>done</button>
      <button onClick={()=>{dispatch(toggleIsEditing(pk))}}>X</button>
    </td>
  );
}
