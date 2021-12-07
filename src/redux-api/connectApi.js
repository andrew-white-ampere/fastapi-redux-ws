import { pipe } from "ramda"
import actionHttp from "./actionHttp"
import addActionMeta from "./actionMeta"
import { httpFetch } from "./httpFetch"
import queueActions from "./queueActions"
import { createReducer } from "./reducer"
import logger from "./log"

export default function connectApi(
  opts,
) {
  const optsInternal = mergeDefaultOpts(opts)

  return {
    middleware: (store) => {
      logger.verbose(
        `Initialising redux api connector for api at ${optsInternal.url}`,
      )

      const handleAction = queueActions(() =>
        optsInternal
          .http({method: "GET", url: optsInternal.url })
          .then(({ body }) =>
            pipe(
              addActionMeta(optsInternal, body),
              actionHttp(optsInternal, store),
            ),
          ),
      )

      return (next) => (action) => {
        logger.verbose(`Handling action of type ${action.type}`)
        next(handleAction(action))
        return store.getState()
      }
    },
    reducer: createReducer(optsInternal),
  }
}

function mergeDefaultOpts(opts) {
  return { http: httpFetch, ...opts }
}
