import React, { useState } from 'react';
import KanbanColumn from './KanbanColumn';
import { Button } from '../ui/button';
import { Plus, List as ListIcon } from 'lucide-react';

// Mock data
const mockTasks = {
  PENDING: [
    { id: '1', content: '웹사이트 배포하기', status: 'PENDING', dueDate: '2025-01-15T23:59:59.999Z' },
    { id: '2', content: '디자인 검토 및 피드백', status: 'PENDING' },
    { id: '3', content: '팀에게 새 웹사이트 링크 전송', status: 'PENDING' },
  ],
  IN_PROGRESS: [
    { id: '4', content: '웹사이트 카피 작성', status: 'IN_PROGRESS', dueDate: '2025-01-10T23:59:59.999Z' },
    { id: '5', content: '3가지 스타일로 디자인 초안 작성', status: 'IN_PROGRESS' },
  ],
  COMPLETED: [
    { id: '6', content: '잠재적 CMS 플랫폼 조사', status: 'COMPLETED' },
    { id: '7', content: '새 웹사이트 구조 개발', status: 'COMPLETED' },
  ],
  EXPIRED: [
    { id: '8', content: '만료된 태스크', status: 'EXPIRED', dueDate: '2024-12-01T23:59:59.999Z' },
  ],
};

export default function KanbanView({ onViewChange }) {
  const [tasks] = useState(mockTasks);

  const handleAddTask = (status) => {
    console.log('Add task to', status);
  };

  const handleCardClick = (task) => {
    console.log('Card clicked:', task);
  };

  const handleDeleteTask = (task) => {
    console.log('Delete task:', task);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-8 py-6 border-b bg-background">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">칸반 보드</h1>
            <p className="text-sm text-muted-foreground mt-1">
              태스크를 드래그하여 상태를 변경하세요
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={() => onViewChange?.('list')} variant="outline" size="sm">
              <ListIcon className="h-4 w-4 mr-2" />
              리스트 뷰
            </Button>
            <Button onClick={() => handleAddTask('PENDING')} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              새 태스크
            </Button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-8">
        <div className="flex gap-6 h-full">
          {Object.keys(tasks).map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={tasks[status]}
              onAddTask={handleAddTask}
              onCardClick={handleCardClick}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
