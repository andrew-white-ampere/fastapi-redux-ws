import { stringify } from "querystring"
import { path, pathEq, pick, pipe, toLower } from "ramda"
import { isString, isObject } from "./util"
import logger from "./log"

const isHttpRequestAction = pathEq(["meta", "kind"], "REQUEST")

function logRequest(action) {
  logger.info(
    `HTTP request action received for type ${
      action.type
    } with method ${httpClientMethod(action)}`,
  )
}

function logResponse(action) {
  logger.info(
    `HTTP response action received for type ${
      action.type
    } with method ${httpClientMethod(action)}`,
  )
}

function performHttpRequest(http, action) {
  const { method, url, body, headers, query } = action.meta
  return http({
    method,
    url: getUrl(url, query),
    body,
    headers,
  })
}

function dispatchResponse(
  store,
  action,
  response,
) {
  logger.verbose(`dispatching http response for ${JSON.stringify(action)} with response ${JSON.stringify(response)}`);
  store.dispatch({
    ...action,
    meta: {
      ...action.meta,
      kind: "RESPONSE",
      response: getHttpResponse(response),
    },
  })
}

export default function actionHttp(opts, store) {
  logger.verbose("Action HTTP handler initialised")

  return (action) => {
    if (isHttpRequestAction(action)) {
        logRequest(action)
        performHttpRequest(opts.http, action).then((response) => {
          if (action.meta.method == "POST" && response.status === 200){
            action = {type: action.type, kind: "REQUEST", meta: {url: action.meta.url, method: "GET", query: {pk: response.body}}};
            performHttpRequest(opts.http, action).then((response)=>{
              logResponse(action);
              dispatchResponse(store, action, response);
            })
          } else {
            logResponse(action);
            dispatchResponse(store, action, response)
          }
        })
    }
    return action
  }
}


function getUrl(url, query) {
  const parsed = new URL(url)

  if (isString(query) && query) {
    parsed.search = query
  }

  if (isObject(query)) {
    parsed.search = stringify(query)
  }

  return parsed.toString()
}



const httpClientMethod = pipe(
  path(["meta", "method"]),
  toLower,
)


const getHttpResponse = (
  pick(["body", "headers", "status", "statusText"])
)

