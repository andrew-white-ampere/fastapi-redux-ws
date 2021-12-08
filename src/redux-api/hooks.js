import { useDispatch } from "react-redux"
import { compose } from "redux"
import {
  createReduxApiActionDelete,
  createReduxApiActionGet,
  createReduxApiActionPatch,
  createReduxApiActionPost,
} from "./actionCreators"

export function makeReduxApiHooks(type) {
  return {
    useDispatchGet: makeReduxApiHookGet(type),
    useDispatchPost: makeReduxApiHookPost(type),
    useDispatchPatch: makeReduxApiHookPatch(type),
    useDispatchDelete: makeReduxApiHookDelete(type),
  }
}

export function makeReduxApiHookGet(type) {
  return createDispatchHookFn(
    createReduxApiActionGet(type),
    formatReduxApiHookName("Get", type),
  )
}

export function makeReduxApiHookPost(type) {
  return createDispatchHookFn(
    createReduxApiActionPost(type),
    formatReduxApiHookName("Post", type),
  )
}

export function makeReduxApiHookPatch(type) {
  return createDispatchHookFn(
    createReduxApiActionPatch(type),
    formatReduxApiHookName("Patch", type),
  )
}

export function makeReduxApiHookDelete(type) {
  return createDispatchHookFn(
    createReduxApiActionDelete(type),
    formatReduxApiHookName("Delete", type),
  )
}

function createDispatchHookFn(
  actionCreator,
  fnName,
) {
  const useHookFn = () => {
    const dispatch = useDispatch();
    return compose(dispatch, actionCreator)
  }

  Object.defineProperty(useHookFn, "name", { value: fnName })

  return useHookFn
}

function formatReduxApiHookName(verb, type) {
  return `useReduxApi${verb}(${type})`
}
