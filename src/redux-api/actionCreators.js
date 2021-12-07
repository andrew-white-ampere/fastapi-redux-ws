
export function createPgRestActions(type) {
  return {
    get: createPgRestActionGet(type),
    post: createPgRestActionPost(type),
    patch: createPgRestActionPatch(type),
    delete: createPgRestActionDelete(type),
  }
}

export function createPgRestActionGet(type) {
  return (query = {}, meta = {}) =>
    ({
      type,
      meta: { query, ...meta },
    })
}

export function createPgRestActionPost(type) {
  return (body, meta = {}) =>
    ({
      type,
      meta: { body, method: "POST", ...meta },
    })
}

export function createPgRestActionPatch(type) {
  return (query, body, meta = {}) =>
    ({
      type,
      meta: { query, method: "PATCH", body, ...meta },
    })
}

export function createPgRestActionDelete(type) {
  return (query, meta = {}) =>
    ({
      type,
      meta: { query, method: "DELETE", ...meta },
    })
}
