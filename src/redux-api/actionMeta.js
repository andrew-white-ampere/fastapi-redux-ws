import {
  concat,
  forEach,
  includes,
  keys,
  pipe,
  prop,
  propSatisfies,
  toLower,
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
      logger.verbose(`Adding REST action meta for ${action.type}`)
      return {
        ...action,
        meta: {
          method: "GET",
          url: concat(opts.url, pathTypePropRest(action)),
          ...getCommonMetaProps(opts, action),
          query: {pk: action.pk}
        },
      }
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
  concat("/"),
)

function matchesRestEndpoint(
  action,
  apiRoot,
) {
  return propSatisfies(
    pipe(keys, includes(pathTypePropRest(action))),
    "paths",
    apiRoot,
  )
}