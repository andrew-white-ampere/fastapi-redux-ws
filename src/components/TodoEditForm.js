import React from "react";
import { useGetEditFormState, useDispatchEditTodo, useSetEditFormState } from "../hooks/todos";
import { makeReduxApiHooks } from "../redux-api/main";
import { useDispatch } from "react-redux";

export default function TodoEditForm({ pk }) {
  const setEditFormState = useSetEditFormState()
  const editFormState = useGetEditFormState()
  const submitTodo = useDispatchEditTodo()
  const { useDispatchPatch } = makeReduxApiHooks('todos');
  const dispatchTodoPatch = useDispatchPatch();
  const dispatch = useDispatch();
  
  
  return (
    <span>
      <input
        type="text"
        onChange={e => setEditFormState({ pk: pk, content: e.target.value })}
        value={editFormState.content}
      />
      <button onClick={()=>dispatch(dispatchTodoPatch({pk: pk}, {content: 'definitely content'}))}>{pk} done</button>
    </span>
  );
}
