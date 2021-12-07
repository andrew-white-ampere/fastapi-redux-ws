import logger from "./log"

export default function queueActions(
  actionHandlerFn,
) {
  const queue = [];

  let actionHandler = (action) => {
    logger.verbose(`Queuing action of type ${action.type}`)
    queue.push(action)
    return action
  }

  actionHandlerFn().then(handler => {
    actionHandler = handler
    logger.info("Endpoint loaded, handling queued actions...")
    processQueuedActions(queue, actionHandler)
  })

  return action => actionHandler(action)
}

function processQueuedActions(queue, handler) {
  while (queue.length) {
    const action = queue.shift()
    if (action) {
      logger.verbose(`Handling queued action of type ${action.type}`)
      handler(action)
    }
  }
}
