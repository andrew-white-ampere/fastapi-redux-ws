import { pathEq, hasPath } from "ramda"
import logger from "./log"

const initialState = {}

export function createReducer(opts) {
  const hasMetaKind = pathEq(["meta", "kind"])

  const isHttpResponse = (action) => (
    hasMetaKind("RESPONSE")(action)
  );

  const isHttpRequest = (action) => (
    hasMetaKind("REQUEST")(action)
  );

  const isMethodGet = (action) => (
    pathEq(["meta", "method"], "GET")(action)
  );

  return (state = initialState, action) => {
    logger.verbose(`Reducing ${action.type} against ${opts.url}`);
    
    if (isHttpResponse(action) && isMethodGet(action)) {
      logMatchingAction(opts.url, "response", action.type);
      
      const hasPrevState = hasPath([action.type])(state) && hasPath([action.meta.method])(state[action.type]);
      const prevResourceState = hasPrevState ? state[action.type][action.meta.method]["body"] : {};
      const indexedResponse =  action.meta.response.body.reduce((a, x) => ({...a, [x.pk]: x}), {});
      const newResourceState = {...prevResourceState, ...indexedResponse};

      // ...prevResourceState,

      return {
        ...state,
        [action.type]: {
          ...state[action.type],
          [action.meta.method]: {
            "body": newResourceState,
            url: action.meta.url,
            query: action.meta.query,
            loading: false,
            requestHeaders: action.meta.headers,
          },
        },
      }
    }

    if (isHttpRequest(action)) {
      logMatchingAction(opts.url, "request", action.type)
      const prevResourceState = state[action.type]

      return {
        ...state,
        [action.type]: {
          ...prevResourceState,
          [action.meta.method]: {
            ...(prevResourceState && prevResourceState[action.meta.method]),
            url: action.meta.url,
            query: action.meta.query,
            loading: true,
          },
        },
      }
    }
    return state
  }
}


function logMatchingAction(url, kind, type) {
  logger.debug(`Reducing received HTTP ${kind} ${type} against ${url}`)
}
