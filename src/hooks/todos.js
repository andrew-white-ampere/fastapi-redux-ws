import { path, prop } from "ramda";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeReduxApiHooks } from "../redux-api/main";
import { processImageContent } from "../helpers/images";
import { EDIT_TODO_FORM_CHANGE } from "../reducers/editTodoForm";
import logger from "../redux-api/log";

const {
  useDispatchGet,
  useDispatchPost,
  useDispatchPatch,
  useDispatchDelete
} = makeReduxApiHooks("todos");

const todosFromState = path(["api", "todos"]);

export function useListTodos(pks=null) {
  const dispatch = useDispatchGet();
  const todos = useSelector(todosFromState);
  
  const [isDispatching, setIsDispatching] = useState();
  const dispatchLoadAction = useCallback(() => {
    setIsDispatching(true);
    pks ? dispatch({pk: pks}) : dispatch();
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
  return useCallback(pk => dispatch({pk: [pk]}),[
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
        dispatch({ content, content_image: image, op: 'POST' })
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
  const { pk, content } = useGetEditFormState();
  logger.verbose(`todopk, content: ${pk}, ${JSON.stringify(content)}`)
  const dispatchPatch = useDispatchPatch();
  const dispatch = useCallback(
    () => dispatchPatch({ pk: pk }, content),
    [dispatchPatch, pk, content]
  );

  return dispatch;
}

export function useDispatchDeleteTodo() {
  const dispatch = useDispatchDelete();

  return useCallback(pk => dispatch({ pk: `${pk}` }), [
    dispatch
  ]);
}
