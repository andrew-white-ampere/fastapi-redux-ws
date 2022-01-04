import { createSlice } from "@reduxjs/toolkit";

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
export { todosFormSlice };