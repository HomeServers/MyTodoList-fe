import React from 'react';
import { LayoutDashboard, List, Calendar, FileDown, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Sidebar({ currentView, onNavigate, user, onLogout }) {
  const menuItems = [
    { id: 'calendar', label: 'Calendar Planner', icon: Calendar },
    { id: 'tasks', label: 'Tasks', icon: LayoutDashboard },
    { id: 'recurring', label: 'Recurring Tasks', icon: List },
    { id: 'import-export', label: 'Import/Export', icon: FileDown },
  ];

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-accent">
        <div className="flex items-center gap-2">
          <List className="h-6 w-6" />
          <h1 className="text-xl font-bold">MyTodoList</h1>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-white"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* User Profile */}
      {user && (
        <div className="p-4 border-t border-sidebar-accent">
          <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-sidebar-accent/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                {user.name?.[0]?.toUpperCase() || user.account?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="text-sm font-medium">{user.name || user.account}</span>
            </div>
            <button
              onClick={onLogout}
              className="p-2 hover:bg-sidebar-accent rounded-md transition-colors"
              title="로그아웃"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
