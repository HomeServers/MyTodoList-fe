import React from 'react';
import { Plus } from 'lucide-react';
import KanbanCard from './KanbanCard';
import { Button } from '../ui/button';

const statusLabels = {
  PENDING: '대기',
  IN_PROGRESS: '진행중',
  COMPLETED: '완료',
  EXPIRED: '만료',
};

export default function KanbanColumn({ status, tasks, onAddTask, onCardClick, onDeleteTask }) {
  const label = statusLabels[status] || status;
  const taskCount = tasks.length;

  return (
    <div className="flex flex-col min-w-[280px] bg-muted/30 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground">{label}</h3>
          <span className="px-2 py-0.5 text-xs font-medium bg-muted rounded-full">
            {taskCount}
          </span>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onAddTask(status)}
          className="h-8 w-8"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3 flex-1">
        {tasks.map((task) => (
          <KanbanCard
            key={task.id}
            task={task}
            onClick={() => onCardClick(task)}
            onDelete={onDeleteTask}
          />
        ))}

        {tasks.length === 0 && (
          <div className="text-center py-8 text-sm text-muted-foreground">
            태스크가 없습니다
          </div>
        )}
      </div>
    </div>
  );
}
