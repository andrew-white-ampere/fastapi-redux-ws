
import { pipe , split} from "ramda"
import actionHttp from "./actionHttp"
import addActionMeta from "./actionMeta"
import logger from "./log"

export default function middleware(optsInternal) { return (store) => {
    logger.verbose(
      `Initialising redux api connector for api at ${optsInternal.url}`,
    )

    return (next) => (action) => {
      logger.verbose(`action is ${JSON.stringify(action)}`);
      if (split('/')(action.type)[0] == "api"){
        optsInternal
        .http({method: "GET", url: optsInternal.url })
        .then(({ body }) =>
          pipe(
            addActionMeta(optsInternal, body),
            actionHttp(optsInternal, store),
          ),
        ).then(handler => next(handler(action)));
      } 
      else {
        next(action);
      }
      return store.getState()
    }
  }
}