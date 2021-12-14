import { httpFetch } from "./httpFetch"
import { createReducer } from "./reducer"
import middleware from "./middleware"

export default function connectApi(
  opts,
) {
  const optsInternal = mergeDefaultOpts(opts)

  return {
    middleware: middleware(optsInternal),
    reducer: createReducer(optsInternal),
  }
}

function mergeDefaultOpts(opts) {
  return { http: httpFetch, ...opts }
}
