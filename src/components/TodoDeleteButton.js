import React from "react";
import { useDeleteTodo } from "../hooks/todos";

export default function TodoDeleteButton({ pk }) {
  const dispatchDeleteAction = useDeleteTodo();
  return <button onClick={() => dispatchDeleteAction(pk)}>╳</button>;
}
