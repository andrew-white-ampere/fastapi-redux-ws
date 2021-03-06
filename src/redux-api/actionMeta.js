import {
  concat,
  forEach,
  includes,
  keys,
  pipe,
  prop,
  propSatisfies,
  toLower,
  hasPath,
  split,
  map,
  slice,
  nth
} from "ramda"
import logger from "./log"
import { isString } from "./util"

export default function addActionMeta(
  opts,
  apiRoot,
){
  logger.verbose("Action meta handler initialised with following paths:")
  forEach(k => logger.verbose(`  ${k}`), keys(prop("paths", apiRoot)))

  return (action) => {
    logger.verbose(`Identifying action meta for ${action.type} with action ${JSON.stringify(action)}`)
    if (matchesRestEndpoint(action, apiRoot)) {
      logger.verbose(`Adding REST action meta for ${action.type} for op ${action.op}`)
        return {
          ...action,
          meta: {
            method: action.method,
            url: concat(opts.url, pathTypePropRest(action)),
            ...getCommonMetaProps(opts, action)
          },
        }
    } else {
      return  {...action}
    }
  }
}

function getCommonMetaProps(
  opts,
  action,
) {
  return {
    api: opts.url,
    kind: "REQUEST",
    ...(action.meta && standardiseActionMeta(action.meta)),
  }
}

function standardiseActionMeta(meta) {
  const { method } = meta

  if (isString(method)) {
    return { ...meta, method: method.toUpperCase() }
  }

  return meta
}

const pathTypePropRest = pipe(
  prop("type"),
  toLower,
  split("/"),
  nth(1),
  concat("/"),
)

function matchesRestEndpoint(
  action,
  apiRoot,
) {
  const resource = split('/')(action.type)[1]; // each action consists of domain then resouce, e.g. "api/todos"
  const pathkeys = map(slice(1, Infinity))(keys(apiRoot["paths"])); // each endpoint starts with "/", hence the slice
  return includes(resource)(pathkeys);
}
