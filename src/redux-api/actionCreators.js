
export function createReduxApiActions(type) {
  return {
    get: createReduxApiActionGet(type),
    post: createReduxApiActionPost(type),
    patch: createReduxApiActionPatch(type),
    delete: createReduxApiActionDelete(type),
  }
}

export function createReduxApiActionGet(type) {
  return (query = {}, meta = {}) =>
    ({
      type,
      meta: { query, ...meta },
    })
}

export function createReduxApiActionPost(type) {
  return (body, meta = {}) =>
    ({
      type,
      meta: { body, method: "POST", ...meta },
    })
}

export function createReduxApiActionPatch(type) {
  return (query, body, meta = {}) =>
    ({
      type,
      meta: { query, method: "PATCH", body, ...meta },
    })
}

export function createReduxApiActionDelete(type) {
  return (query, meta = {}) =>
    ({
      type,
      meta: { query, method: "DELETE", ...meta },
    })
}
