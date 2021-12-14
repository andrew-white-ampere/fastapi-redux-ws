
import jws from 'jws';
import logger from '../redux-api/log';
import { hasPath, anyPass } from 'ramda';
import {
  pipe,
  prop,
  toLower,
  concat
} from 'ramda';
import { httpFetch } from '../redux-api/httpFetch';
import addActionMeta from '../redux-api/actionMeta';
import actionHttp from '../redux-api/actionHttp';

function sign(payload, key) {
  return { result: jws.sign({header: {alg: 'HS256'}, payload: JSON.stringify(payload), secret: key}), error: '' };
}

function get_jwt() {
  return sign({
    mode: 'rw'
  }, 'auwhfdnskjhewfi34uwehdlaehsfkuaeiskjnfduierhfsiweskjcnzeiluwhskdewishdnpwe').result;
}

export default function connectPgWebsocket({ wsUrl, apiUrl }) {
  const opts = {http: httpFetch, url: apiUrl}
  return next => {
    return reducer => {
      const store = next(reducer);
      const ws = new WebSocket(`${wsUrl}/${get_jwt()}`);
      ws.addEventListener("message", ({ data }) => handleWsMessage(opts, store, data));
      return store;
    };
  };
}

const getTypeFromResource = (resource) => `api/${resource}`;

function extractRelevantAction(store, payload) {
  const state = store.getState()
  const hasType = hasPath(['api', payload.resource])(state);
  if (!hasType) return null;
  const hasPk = hasPath(['pk'])(payload);
  if (!hasPk) return payload;
  payload.pk = payload.pk.map(pk => {if (hasPath(["api", payload.resource, `${pk}`], state)) {return pk}});
  return payload;
}

function handleUpdate(opts, store, payload){
  const action = {type: getTypeFromResource(payload.resource), meta: {method: "GET", kind: "REQUEST", query: {pk: payload.pk}}};
  opts
    .http({method: "GET", url: opts.url})
    .then(({ body }) =>
      pipe(
        addActionMeta(opts, body),
        actionHttp(opts, store),
      )).then(handler => handler(action));
}

function handleDelete(store, payload){
  store.dispatch({type: getTypeFromResource(payload.resource), meta: {method: "DELETE", kind: "RESPONSE", response: {body: payload.pk}}});
}

function handleTruncate(store, payload){
  store.dispatch({type: getTypeFromResource(payload.resource), meta: {method: "TRUNCATE", kind: "RESPONSE"}});
}

function handleWsMessage(opts, store, data) {
  try {
    const { resource } = JSON.parse(data);
    var  payload  = JSON.parse(resource);
    logger.verbose(`RECEIVED WS PAYLOAD: ${JSON.stringify(payload)} AT TIME ${new Date().toISOString()}`)
    payload = extractRelevantAction(store, payload);
    if (payload){
      switch (payload.op) {
        case "UPDATE":
          handleUpdate(opts, store, payload);
          break;
        case "DELETE":
          handleDelete(store, payload);
          break;
        case "TRUNCATE":
          handleTruncate(store, payload);
          break;
        default:
          break;
      }
    }
    logger.verbose(`FINISHED PROCESSING PAYLOAD AT TIME ${new Date().toISOString()}`)
  } catch (e) {
    console.error("Could not process message:");
    console.error(data);
    console.error(e);
  }
}
