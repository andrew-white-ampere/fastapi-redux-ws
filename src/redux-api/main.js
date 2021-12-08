import connectApi from "./connectApi"
import {
  createReduxApiActions,
  createReduxApiActionGet,
  createReduxApiActionPost,
  createReduxApiActionPatch,
  createReduxApiActionDelete,
} from "./actionCreators"
import {
  makeReduxApiHooks,
  makeReduxApiHookGet,
  makeReduxApiHookPost,
  makeReduxApiHookPatch,
  makeReduxApiHookDelete,
} from "./hooks"

import { createReduxApiSelectors } from "./selectors"

export {
  connectApi as connectReduxApi,
  createReduxApiActions,
  createReduxApiActionGet,
  createReduxApiActionPost,
  createReduxApiActionPatch,
  createReduxApiActionDelete,
  createReduxApiSelectors,
  makeReduxApiHooks,
  makeReduxApiHookGet,
  makeReduxApiHookPost,
  makeReduxApiHookPatch,
  makeReduxApiHookDelete,
}
