import React, { useState, useEffect } from 'react';
import { useKanban } from './hooks/useKanban';
import { KanbanBoard } from './components/Kanban/KanbanBoard';
import LoginPage from './pages/LoginPage';
import './components/buttons/styles/buttons.css';

export default function App() {
  // localStorage에서 user 복원
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const accessToken = user?.accessToken;
  const { tasks, handleDragEnd, addTask, updateTask, deleteTask } = useKanban(accessToken);

  // user 상태 변경 시 localStorage 동기화
  useEffect(() => {
    if (user && user.accessToken) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  return (
    <KanbanBoard 
      tasks={tasks} 
      onDragEnd={handleDragEnd}
      onAddTask={addTask}
      onUpdateTask={updateTask}
      onDeleteTask={deleteTask}
    />
  );
}