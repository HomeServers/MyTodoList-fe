import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import MainLayout from './components/layout/MainLayout';
import CalendarView from './components/calendar/CalendarView';
import KanbanView from './components/kanban/KanbanView';
import ListView from './components/list/ListView';

function App() {
  const [user, setUser] = useState(null);
  const [viewMode, setViewMode] = useState('kanban');

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
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
          {currentView === 'calendar' && <CalendarView />}

          {/* Tasks (Kanban or List) */}
          {currentView === 'tasks' && (
            <>
              {viewMode === 'kanban' ? (
                <KanbanView onViewChange={setViewMode} />
              ) : (
                <ListView onViewChange={setViewMode} />
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
