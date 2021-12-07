import "isomorphic-fetch"

export function httpFetch(config){
  const { url } = config
  return fetch(url, getDefaultFetchConfig(config)).then(
    handleFetchResponse(url),
  )
}

export function getDefaultFetchConfig(config) {
  const { method, body, headers } = config
  return {
    method,
    body: body ? JSON.stringify(body) : null,
    headers: {
      "content-type": "application/json",
      ...headers,
    },
  }
}

export function handleFetchResponse(url) {
  return (res) =>
    res
      .json()
      .catch(() => undefined)
      .then(body => ({
        body,
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
        url,
      }))
}
