import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { connectReduxApi } from "./redux-api/main";
import connectPgWebsocket from "./helpers/ws";
import editTodo from './reducers/editTodoForm'

const { reducer, middleware } = connectReduxApi({
  url: "http://localhost:8000"
});

const store = configureStore(
  {
    reducer: {api: reducer, editTodo: editTodo},
    devTools: true,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([middleware]),
    enhancers: [connectPgWebsocket({ wsUrl: "ws://localhost:8080/websocket", apiUrl: "http://localhost:8000"})]
  }
)

export default store;
