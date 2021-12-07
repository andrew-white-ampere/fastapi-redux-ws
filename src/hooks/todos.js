import { path, prop } from "ramda";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makePgRestHooks } from "../redux-api/main";
import { processImageContent } from "../helpers/images";
import { EDIT_TODO_FORM_CHANGE } from "../reducers/editTodoForm";

const {
  useDispatchGet,
  useDispatchPost,
  useDispatchPatch,
  useDispatchDelete
} = makePgRestHooks("todos");

const todosFromState = path(["api", "todos", "GET", "body"]);

export function useListTodos() {
  const dispatch = useDispatchGet();
  const todos = useSelector(todosFromState);
  const [isDispatching, setIsDispatching] = useState();
  const dispatchLoadAction = useCallback(() => {
    setIsDispatching(true);
    dispatch();
  }, [setIsDispatching, dispatch]);

  useEffect(() => {
    if (!todos && !isDispatching) {
      dispatchLoadAction();
    }
  }, [dispatchLoadAction, todos, isDispatching]);
  console.log(JSON.stringify(todos));
  return todos;
}

export function useGetTodo(){
  const dispatch = useDispatchGet();
  return useCallback(pk => dispatch({pk: `${pk}`}),[
    dispatch
  ]);
}

export function useCreateTodo() {
  const dispatch = useDispatchPost();
  const [content, setContent] = useState("");
  const [imageContent, setImageContent] = useState(null);
  const submitTodo = useCallback(
    () =>
      processImageContent(imageContent).then(image =>
        dispatch({ content, content_image: image })
      ),
    [dispatch, content, imageContent]
  );

  return { content, setContent, setImageContent, submitTodo };
}

const getEditState = prop("editTodo");

export function useGetEditFormState() {
  return useSelector(getEditState);
}

export function useSetEditFormState() {
  const dispatch = useDispatch();
  return state => dispatch({ type: EDIT_TODO_FORM_CHANGE, ...state });
}

export function useDispatchEditTodo() {
  const { todo_id, content } = useGetEditFormState();
  const dispatchPatch = useDispatchPatch();
  const dispatch = useCallback(
    () => dispatchPatch({ todo_id: `eq.${todo_id}` }, { content }),
    [dispatchPatch, todo_id, content]
  );

  return dispatch;
}

export function useDeleteTodo() {
  const dispatch = useDispatchDelete();

  return useCallback(pk => dispatch({ pk: `${pk}` }), [
    dispatch
  ]);
}
