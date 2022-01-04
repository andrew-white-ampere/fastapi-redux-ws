import { configureStore } from '@reduxjs/toolkit';
import { connectReduxApi } from "./redux-api/main";
import { editTodoSlice } from './slices/editTodo';
import { todosFormSlice } from './slices/todosForm';
import connectPgWebsocket from "./helpers/ws";

const { reducer, middleware } = connectReduxApi({
  url: "http://localhost:8000"
});


const store = configureStore(
  {
    reducer: {
      api: reducer, 
      todosForm: todosFormSlice.reducer, 
      editTodo: editTodoSlice.reducer
    },
    devTools: true,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([middleware]),
    enhancers: [connectPgWebsocket({ wsUrl: "ws://localhost:8080/websocket", apiUrl: "http://localhost:8000"})]
  }
)

export default store;
