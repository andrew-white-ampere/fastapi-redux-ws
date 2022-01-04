import { createSlice, configureStore } from '@reduxjs/toolkit';
import { connectReduxApi } from "./redux-api/main";
import connectPgWebsocket from "./helpers/ws";
import editTodo from './reducers/editTodoForm'
import logger from './redux-api/log';
import { hasPath } from 'ramda';

const { reducer, middleware } = connectReduxApi({
  url: "http://localhost:8000"
});

const todosFormSlice = createSlice({
  name: 'todosForm',
  initialState: { content: "What do you want to do?" },
  reducers: {
    setTodosFormState: (state, action) => {
      state.content = action.payload
    }
  }
})

export const { setTodosFormState } = todosFormSlice.actions;

const editTodoSlice = createSlice({
  name: 'editTodo',
  initialState: { },
  reducers: {
    toggleIsEditing: (state, action) => {
      const payload = action.payload;
      logger.verbose(`TOGGLING ISEDITING WITH action ${JSON.stringify(action)} PAYLOAD ${payload}`);
      if (hasPath([action.payload], state)){
        state[action.payload]["isEditing"] = !state[action.payload]["isEditing"];
      } else {
        state[action.payload] = {isEditing: true, content: ""};
      }
    },
    setEditTodoState: (state, action) => {
      state[action.payload.pk]["content"] = action.payload.content;
    }
  }
});

export const { toggleIsEditing, setEditTodoState } = editTodoSlice.actions;

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
