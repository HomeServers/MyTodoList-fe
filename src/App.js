import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import MainLayout from './components/layout/MainLayout';
import CalendarView from './components/calendar/CalendarView';
import KanbanView from './components/kanban/KanbanView';
import ListView from './components/list/ListView';
import useLocalStorage from './hooks/useLocalStorage';
import useTasks from './hooks/useTasks';

function App() {
  // localStorage에서 user 복원
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [viewMode, setViewMode] = useLocalStorage('preferredView', 'kanban');

  // 태스크 관리 훅
  const {
    tasks,
    loading,
    error,
    loadTasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
  } = useTasks(user?.accessToken);

  // user 상태 변경 시 localStorage 동기화
  useEffect(() => {
    if (user && user.accessToken) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <MainLayout user={user} onLogout={handleLogout}>
      {({ currentView }) => (
        <>
          {/* Calendar Planner */}
          {currentView === 'calendar' && (
            <CalendarView
              tasks={tasks}
              loading={loading}
              error={error}
            />
          )}

          {/* Tasks (Kanban or List) */}
          {currentView === 'tasks' && (
            <>
              {viewMode === 'kanban' ? (
                <KanbanView
                  tasks={tasks}
                  onViewChange={setViewMode}
                  onAddTask={addTask}
                  onUpdateTask={updateTask}
                  onDeleteTask={deleteTask}
                  onMoveTask={moveTask}
                  loading={loading}
                  error={error}
                />
              ) : (
                <ListView
                  tasks={tasks}
                  onViewChange={setViewMode}
                  onAddTask={addTask}
                  onUpdateTask={updateTask}
                  onDeleteTask={deleteTask}
                  loading={loading}
                  error={error}
                />
              )}
            </>
          )}

          {/* Recurring Tasks */}
          {currentView === 'recurring' && (
            <div className="flex items-center justify-center h-full p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">반복 일정</h2>
                <p className="text-muted-foreground">
                  반복 일정 기능은 Phase 3에서 구현 예정입니다.
                </p>
              </div>
            </div>
          )}

          {/* Import/Export */}
          {currentView === 'import-export' && (
            <div className="flex items-center justify-center h-full p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Import / Export</h2>
                <p className="text-muted-foreground">
                  .ics 파일로 태스크를 가져오거나 내보낼 수 있습니다.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </MainLayout>
  );
}

export default App;
