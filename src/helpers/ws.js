
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
  return { result: jws.sign({header: {alg: 'HS256'}, payload: JSON.stringify(payload), secret: 'auwhfdnskjhewfi34uwehdlaehsfkuaeiskjnfduierhfsiweskjcnzeiluwhskdewishdnpwe'}), error: '' };
}

function get_jwt() {
  return sign({
    mode: 'rw'
  }, 'auwhfdnskjhewfi34uwehdlaehsfkuaeiskjnfduierhfsiweskjcnzeiluwhskdewishdnpwe').result;
}

export default function connectPgWebsocket({ url }) {
  return next => {
    return reducer => {
      const store = next(reducer);
      const jwt = get_jwt();
      const wsurl = url+ '/' + jwt;
      const ws = new WebSocket(wsurl);
      
      addWsMessageListener(ws, store);

      return store;
    };
  };
}

function addWsMessageListener(ws, store) {
  ws.addEventListener("message", ({ data }) => handleWsMessage(store, data));
}

function extractRelevantAction(store, payload) {
  const state = store.getState()
  const hasType = hasPath(['api', payload.resource, "GET", "body"])(state);
  if (!hasType) return false;
  payload.pk = payload.pk.map(pk => {if (hasPath(["api", payload.resource, "GET", "body", `${pk}`], state)) {return pk}});
  if (payload.pk.length === 0) return null;
  return payload;
}

const pathTypePropRest = pipe(
  prop("type"),
  toLower,
  concat("/"),
)

function handleWsMessage(store, data) {
  try {
    const { resource } = JSON.parse(data);
    const  payload  = JSON.parse(resource);
    logger.verbose(`RECEIVED WS PAYLOAD: ${JSON.stringify(payload)}`)
    const relevantAction = extractRelevantAction(store, payload);
    if (relevantAction){
      if (payload.op === "UPDATE"){
        const action = {type: payload.resource, meta: {method: "GET", kind: "REQUEST", query: {pk: relevantAction.pk}}};
        const opts = {http: httpFetch, url: 'http://localhost:8000'}
        opts
          .http({method: "GET", url: opts.url})
          .then(({ body }) =>
            pipe(
              addActionMeta(opts, body),
              actionHttp(opts, store),
            )).then(handler => handler(action));
        // logger.verbose(`DISPATCHING ACTION ${JSON.stringify(action)} against payload ${JSON.stringify(payload)}`);
        // store.dispatch(action);
      }
    }
  } catch (e) {
    console.error("Could not process message:");
    console.error(data);
    console.error(e);
  }
}
