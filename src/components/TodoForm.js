import { Button } from "@material-ui/core";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeReduxApiHooks } from "../redux-api/main";
import { setTodosFormState } from "../slices/todosForm";

export default function TodoForm() {
  const { useDispatchGet, useDispatchPost } = makeReduxApiHooks("todos");
  const dispatchGet = useDispatchGet();
  const dispatchPost = useDispatchPost();
  const dispatch = useDispatch();
  const content = useSelector((state) => state.todosForm.content);
  return (
    <form
      type=""
      onSubmit={e => {
        e.preventDefault();
        dispatchPost({content: content})
      }}
    >
      <Button onClick={()=>{dispatchGet()}}>GET</Button>
      <div>
        <input
          placeholder="I need to..."
          type="text"
          value={content}
          onChange={(e) =>  {dispatch(setTodosFormState(e.target.value))}}
        />
        <input value="＋" type="submit" />
      </div>
      <div>
        <input type="file" onChange={e => {}} />
      </div>
    </form>
  );
}
