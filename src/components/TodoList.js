import React from "react";
import { useListTodos } from "../hooks/todos";
import { useDispatchHideTodoImage, useSelectTodoImage, useTodoImageState } from "../hooks/todoImage";
import TodoListItem from "./TodoListItem";
import { makeStyles } from '@material-ui/core/styles';
import logo from "../images/logo.svg";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

export default function Todos() {
  const todos = useListTodos();
  const dispatchHideTodoImage = useDispatchHideTodoImage()
  const imageState = useTodoImageState();
  const todo_image =  useSelectTodoImage();
  
  // if (todos && imageState.show) {
  //   return (
  //     <div className="todos">
  //       <img
  //         className="todo-image-full"
  //         alt="uploaded with the todo"
  //         src={todo_image}
  //         onClick={dispatchHideTodoImage}
  //       />
  //     </div>
  //   );
  // }
  
  return (
    <div>
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell align="right" onClick={dispatchHideTodoImage}>Calories</TableCell>
            <TableCell align="left">Fat&nbsp;(g)</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
      {todos &&
        Object.entries(todos).map(([todo_pk, props]) => (
          <TodoListItem  {...props} key={todo_pk}/>
        ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
}
