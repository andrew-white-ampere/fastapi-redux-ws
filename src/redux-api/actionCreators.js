
export function createReduxApiActions(endpoint) {
  return {
    get: createReduxApiActionGet(endpoint),
    post: createReduxApiActionPost(endpoint),
    patch: createReduxApiActionPatch(endpoint),
    delete: createReduxApiActionDelete(endpoint),
  }
}

const getEndpointType = (endpoint) => `api/${endpoint}`;

export function createReduxApiActionGet(endpoint) {
  const type = getEndpointType(endpoint);
  return (query = {}, meta = {}) =>
    ({
      type,
      meta: { query, method: "GET", ...meta },
    })
}

export function createReduxApiActionPost(endpoint) {
  const type = getEndpointType(endpoint);
  return (body, meta = {}) =>
    ({
      type,
      meta: { body, method: "POST", ...meta },
    })
}

export function createReduxApiActionPatch(endpoint) {
  const type = getEndpointType(endpoint);
  return (query, body, meta = {}) =>
    ({
      type,
      meta: { query, method: "PATCH", body, ...meta },
    })
}

export function createReduxApiActionDelete(endpoint) {
  const type = getEndpointType(endpoint);
  return (query, meta = {}) =>
    ({
      type,
      meta: { query, method: "DELETE", ...meta },
    })
}
