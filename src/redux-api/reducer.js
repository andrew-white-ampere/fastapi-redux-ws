import { allPass, pathEq, propOr } from "ramda"
import logger from "./log"


const initialState = {}

const urlProp = propOr("", "url")

export function createReducer(opts) {
  const isApiAction = pathEq(["meta", "api"], urlProp(opts))
  const hasMetaKind = pathEq(["meta", "kind"])

  const isHttpResponse = (action) => (
    hasMetaKind("RESPONSE")(action)
  )

  const isHttpRequest = (action) => (
    hasMetaKind("REQUEST")(action)
  )

  return (state = initialState, action) => {
    logger.verbose(`Reducing ${action.type} against ${opts.url}`)
    
    if (isHttpResponse(action)) {
      logMatchingAction(opts.url, "response", action.type)
      return {
        ...state,
        [action.type]: {
          ...initialResourceState(),
          ...state[action.type],
          [action.meta.method]: {
            ...action.meta.response,
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
          ...initialResourceState(),
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

function initialResourceState() {
  return {
    ["GET"]: null,
    ["POST"]: null,
    ["PATCH"]: null,
    ["DELETE"]: null,
  }
}

function logMatchingAction(url, kind, type) {
  logger.debug(`Reducing received HTTP ${kind} ${type} against ${url}`)
}
