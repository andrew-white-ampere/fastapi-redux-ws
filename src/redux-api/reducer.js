import { pathEq, hasPath, pipe } from "ramda"
import logger from "./log"

const initialState = {}

export function createReducer(opts) {
  const hasMetaKind = pathEq(["meta", "kind"])

  const isHttpResponse = (action) => (
    hasMetaKind("RESPONSE")(action)
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
    logger.verbose(`Reducing ${action.type} against ${opts.url}`);
    
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


function logMatchingAction(url, kind, type) {
  logger.debug(`Reducing received HTTP ${kind} ${type} against ${url}`)
}
