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

  const isMethodPost = (action) => (
    pathEq(["meta", "method"], "POST")(action)
  );

  return (state = initialState, action) => {
    logger.verbose(`Reducing ${action.type} against ${opts.url}`);
    
    if (isHttpResponse(action) && isMethodGet(action)) {
      logMatchingAction(opts.url, "response", action.type);
      
      const hasPrevState = hasPath([action.type])(state) && hasPath([action.meta.method])(state[action.type]);
      const prevResourceState = hasPrevState ? state[action.type][action.meta.method]["body"] : {};
      const indexedResponse =  action.meta.response.body.reduce((a, x) => ({...a, [x.pk]: x}), {});
      const newResourceState = {...prevResourceState, ...indexedResponse};

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
    
    if (hasPath(["op"])(action) && action.op === "DELETE"){
      
      const hasPrevState = hasPath([action.type])(state) && hasPath([action.meta.method])(state[action.type]);
      const resourceState = hasPrevState ? state[action.type][action.meta.method]["body"] : {};
      
      action.pk.forEach(pk => {if (pk in resourceState) delete resourceState[pk]})
      
      return {
        ...state,
        [action.type]: {
          ...state[action.type],
          [action.meta.method]: {
            "body": resourceState,
            loading: false
          }
        }
      }
    }

    if (isHttpResponse(action) && isMethodPost(action)){
      logger.verbose(`ismethod post response`);
      const hasPrevState = hasPath([action.type])(state) && hasPath([action.meta.method])(state[action.type]);
      const resourceState = hasPrevState ? state[action.type][action.meta.method]["body"] : {};
      const newObj = {
        [action.meta.response.body]: {pk: action.meta.response.body}
      }

      const newResourceState = {...resourceState, ...newObj}

      logger.verbose(`new resource state is ${JSON.stringify(newResourceState)}`);

      return {
        ...state,
        [action.type]: {
          ...state[action.type],
          [action.meta.method]: {
            "body": newResourceState,
            loading: false
          }
        }
      }
    }

    
    return state
  }
}


function logMatchingAction(url, kind, type) {
  logger.debug(`Reducing received HTTP ${kind} ${type} against ${url}`)
}
