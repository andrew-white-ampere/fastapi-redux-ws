import { pathEq, hasPath } from "ramda"

const initialState = {}

export function createReducer(opts) {

  const isHttpResponse = (action) => (
    pathEq(["meta", "kind"], "RESPONSE")(action)
  );

  const isMethodGet = (action) => (
    pathEq(["meta", "method"], "GET")(action)
  );

  const isMethodDelete = (action) => (
    pathEq(["meta", "method"], "DELETE")(action)
  );

  const isMethodTruncate = (action) => (
    pathEq(["meta", "method"], "TRUNCATE")(action)
  );

  return (state = initialState, action) => {
    
    if (isHttpResponse(action)){
      const hasPrevState = hasPath([action.type])(state);
      const resourceState = hasPrevState ? {...state[action.type]} : {};
      
      if (isMethodGet(action)) {
        const newResourceState = {...resourceState, ...action.meta.response.body};
        return {
          ...state,
          [action.type]: {
            ...state[action.type],
            ...newResourceState
          },
        }
      }
      else if (isMethodDelete(action)){
        action.meta.response.body.forEach(pk => delete resourceState[pk]);
        return {
          ...state,
          [action.type]: {
            ...resourceState
          }
        }
      }
      else if ((isMethodTruncate(action))){
        return {
          ...state,
          [action.type]: {}
        }
      }
    }

    
    return state
  }
}