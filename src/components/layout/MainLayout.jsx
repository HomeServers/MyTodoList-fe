import React, { useState } from 'react';
import Sidebar from './Sidebar';

export default function MainLayout({ children, user, onLogout }) {
  const [currentView, setCurrentView] = useState('calendar');

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        currentView={currentView}
        onNavigate={setCurrentView}
        user={user}
        onLogout={onLogout}
      />
      <main className="flex-1 overflow-auto">
        {children({ currentView })}
      </main>
    </div>
  );
}
