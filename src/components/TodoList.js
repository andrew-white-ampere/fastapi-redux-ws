import React from "react";
import TodoListItem from "./TodoListItem";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useSelector } from "react-redux";
import { path } from "ramda";

export default function Todos() {
  const todos = useSelector(path(["api", "api/todos"]));

  return (
    <div>
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="left">Fat&nbsp;(g)</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
      {todos &&
        Object.entries(todos).map(([pk, props]) => (
          <TodoListItem  {...props} key={pk}/>
        ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
}
