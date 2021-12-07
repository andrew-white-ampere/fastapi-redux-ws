
import jws from 'jws'

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

function handleWsMessage(store, data) {
  try {
    dispatchWsMessage(store, data);
  } catch (e) {
    console.error("Could not process message:");
    console.error(data);
    console.error(e);
  }
}

function dispatchWsMessage(store, data) {
  const { resource } = JSON.parse(data);
  const payload = JSON.parse(resource);
  store.dispatch({ type: payload.resource, pk: payload.pk });
}
