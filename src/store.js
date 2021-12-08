import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { connectReduxApi } from "./redux-api/main";
import connectPgWebsocket from "./helpers/ws";
import editTodo from './reducers/editTodoForm'
import todoImage from './reducers/todoImage'

const { reducer, middleware } = connectReduxApi({
  url: "http://localhost:8000"
});

const store = createStore(
  combineReducers({api: reducer, editTodo, todoImage}),
  composeWithDevTools( 
    connectPgWebsocket({ url: "ws://localhost:8080/websocket" }),
    applyMiddleware(middleware)
  )
);

export default store;
