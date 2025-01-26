import React from "react";
import TodoItem from "../components/TodoItem";

function TodoList({ todos, deleteTodo, toggleTodo }) {
  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          toggleTodo={toggleTodo}
        />
      ))}
    </ul>
  );
}

export default TodoList;