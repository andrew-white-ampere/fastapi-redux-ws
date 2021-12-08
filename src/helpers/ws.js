
import jws from 'jws';
import logger from '../redux-api/log';
import { hasPath, anyPass } from 'ramda';


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

function isRelevantAction(store, action) {
  logger.verbose(`action is ${JSON.stringify(action)}`)
  const pkPresent = hasPath(["pk"])(action);
  logger.verbose(`pk is present? ${pkPresent}`)
  if (!pkPresent) return true;
  const state = store.getState()
  const hasType = hasPath(['api', action.resource, "GET", "body"])(state);
  logger.verbose(`hastype ${hasType}`)
  if (!hasType) return true;
  logger.verbose(`state: ${JSON.stringify(state)}`);
  let stateHasPk = false;
  for (let i = 0; i < action.pk.length; ++i){
    logger.verbose(`action pk is ${action.pk[i]}`)
      if (hasPath([`${action.pk[i]}`])(state['api'][action.resource]["GET"]["body"])){
        stateHasPk = true;
        break;
      }
  }
  logger.verbose(`statehaspk ${stateHasPk}`)
  if (!stateHasPk) return false;
  logger.verbose(`relevantaction returning true`)
  return true;
}


function handleWsMessage(store, data) {
  try {
    const { resource } = JSON.parse(data);
    const payload = JSON.parse(resource);
    if (isRelevantAction(store, payload)){
      store.dispatch({ type: payload.resource, op: payload.op, pk: payload.pk });
    }
  } catch (e) {
    console.error("Could not process message:");
    console.error(data);
    console.error(e);
  }
}
