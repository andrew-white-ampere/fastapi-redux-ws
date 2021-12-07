import { useDispatch } from "react-redux"
import { compose } from "redux"
import {
  createPgRestActionDelete,
  createPgRestActionGet,
  createPgRestActionPatch,
  createPgRestActionPost,
} from "./actionCreators"

export function makePgRestHooks(type) {
  return {
    useDispatchGet: makePgRestHookGet(type),
    useDispatchPost: makePgRestHookPost(type),
    useDispatchPatch: makePgRestHookPatch(type),
    useDispatchDelete: makePgRestHookDelete(type),
  }
}

export function makePgRestHookGet(type) {
  return createDispatchHookFn(
    createPgRestActionGet(type),
    formatPgRestHookName("Get", type),
  )
}

export function makePgRestHookPost(type) {
  return createDispatchHookFn(
    createPgRestActionPost(type),
    formatPgRestHookName("Post", type),
  )
}

export function makePgRestHookPatch(type) {
  return createDispatchHookFn(
    createPgRestActionPatch(type),
    formatPgRestHookName("Patch", type),
  )
}

export function makePgRestHookDelete(type) {
  return createDispatchHookFn(
    createPgRestActionDelete(type),
    formatPgRestHookName("Delete", type),
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

function formatPgRestHookName(verb, type) {
  return `usePgRest${verb}(${type})`
}
