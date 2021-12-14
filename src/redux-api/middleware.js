
import { pipe } from "ramda"
import actionHttp from "./actionHttp"
import addActionMeta from "./actionMeta"
import logger from "./log"

export default function middleware(optsInternal) { return (store) => {
    logger.verbose(
      `Initialising redux api connector for api at ${optsInternal.url}`,
    )

    return (next) => (action) => {
      logger.verbose(`Handling action of type ${action.type}`);
      optsInternal
        .http({method: "GET", url: optsInternal.url })
        .then(({ body }) =>
          pipe(
            addActionMeta(optsInternal, body),
            actionHttp(optsInternal, store),
          ),
        ).then(handler => next(handler(action)));
      return store.getState()
    }
  }
}