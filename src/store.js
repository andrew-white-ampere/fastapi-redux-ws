import { createSlice, configureStore } from '@reduxjs/toolkit';
import { connectReduxApi } from "./redux-api/main";
import connectPgWebsocket from "./helpers/ws";
import editTodo from './reducers/editTodoForm'
import logger from './redux-api/log';

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
  initialState: { isEditing: {}, },
  reducers: {
    toggleIsEditing: (state, action) => {
      const payload = action.payload;
      logger.verbose(`TOGGLING ISEDITING WITH action ${JSON.stringify(action)} PAYLOAD ${payload}`);
      if (action.payload in state.isEditing){
        state.isEditing[action.payload] = !state.isEditing[action.payload]
      } else {
        state.isEditing[action.payload] = true;
      }
    }
  }
});

export const { toggleIsEditing } = editTodoSlice.actions;

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
