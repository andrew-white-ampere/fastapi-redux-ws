import React from "react";
import { useGetEditFormState, useDispatchEditTodo, useSetEditFormState } from "../hooks/todos";

export default function TodoEditForm({ pk }) {
  const setEditFormState = useSetEditFormState()
  const editFormState = useGetEditFormState()
  const submitTodo = useDispatchEditTodo()
  
  return (
    <span>
      <input
        type="text"
        onChange={e => setEditFormState({ pk: pk, content: e.target.value })}
        value={editFormState.content}
      />
      <button onClick={()=>submitTodo()}>{pk} done</button>
    </span>
  );
}
