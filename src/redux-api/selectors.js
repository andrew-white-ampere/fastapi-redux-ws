import { has, identity, ifElse, pathOr, pipe } from "ramda"



export function createReduxApiSelectors(
  reducerKey = '',
) {
  const createSelectorFactoryForMethod = createSelectorFactoryForReducer(
    reducerKey,
  )
  return {
    get: createSelectorFactoryForMethod("GET"),
    post: createSelectorFactoryForMethod("POST"),
    patch: createSelectorFactoryForMethod("PATCH"),
    delete: createSelectorFactoryForMethod("DELETE"),
  }
}


function createReducerPathChecker(
  reducerKey,
) {
  if (reducerKey) {
    return ifElse(has(reducerKey), identity, () => {
      throw new Error(`Reducer state with key '${reducerKey}' not found'`)
    })
  }

  return identity
}

function createSelectorFactoryForReducer(
  reducerKey,
) {
  if (reducerKey) {
    return (method) => (resource) =>
      pipe(
        createReducerPathChecker(reducerKey),
        pathOr(null, [reducerKey, resource, method]),
      )
  }

  return (method) => (resource) =>
    pipe(
      createReducerPathChecker(reducerKey),
      pathOr(null, [resource, method]),
    )
}
