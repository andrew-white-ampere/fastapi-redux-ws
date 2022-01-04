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


export {
  connectApi as connectReduxApi,
  createReduxApiActions,
  createReduxApiActionGet,
  createReduxApiActionPost,
  createReduxApiActionPatch,
  createReduxApiActionDelete,
  makeReduxApiHooks,
  makeReduxApiHookGet,
  makeReduxApiHookPost,
  makeReduxApiHookPatch,
  makeReduxApiHookDelete,
}
