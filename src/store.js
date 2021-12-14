import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { connectReduxApi } from "./redux-api/main";
import connectPgWebsocket from "./helpers/ws";
import editTodo from './reducers/editTodoForm'

const { reducer, middleware } = connectReduxApi({
  url: "http://localhost:8000"
});

// const store = createStore(
//   combineReducers({api: reducer, editTodo, todoImage}),
//   composeWithDevTools( 
//     connectPgWebsocket({ url: "ws://localhost:8080/websocket" }),
//     applyMiddleware(middleware)
//   )
// );

const store = configureStore(
  {
    reducer: {api: reducer, editTodo: editTodo},
    devTools: true,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([middleware]),
    enhancers: [connectPgWebsocket({ url: "ws://localhost:8080/websocket"})]
  }
)

export default store;
