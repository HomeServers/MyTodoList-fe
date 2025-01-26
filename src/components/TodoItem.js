import React from "react";

function TodoItem({ todo, deleteTodo, toggleTodo }) {
  return (
    <li style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
      <span onClick={() => toggleTodo(todo.id)}>{todo.task}</span>
      <button onClick={() => deleteTodo(todo.id)}>Delete</button>
    </li>
  );
}

export default TodoItem;