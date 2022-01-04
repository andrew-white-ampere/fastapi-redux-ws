import { createSlice } from "@reduxjs/toolkit";
import { hasPath } from "ramda";

const editTodoSlice = createSlice({
    name: 'editTodo',
    initialState: { },
    reducers: {
      toggleIsEditing: (state, action) => {
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
export { editTodoSlice };