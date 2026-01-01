import React from 'react';
import { Calendar, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const statusColors = {
  PENDING: 'bg-status-pending',
  IN_PROGRESS: 'bg-status-inProgress',
  COMPLETED: 'bg-status-completed',
  EXPIRED: 'bg-status-expired',
};

export default function KanbanCard({ task, onClick, onDelete, isDragging }) {
  const bgColor = statusColors[task.status] || statusColors.PENDING;

  return (
    <div
      className={cn(
        "p-4 rounded-lg cursor-pointer overflow-hidden",
        "transition-shadow duration-150 hover:shadow-md",
        bgColor,
        isDragging && "opacity-50 rotate-2 scale-105"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p
          className="text-sm font-medium text-foreground flex-1 break-words line-clamp-3 whitespace-pre-wrap"
          style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
        >
          {task.content}
        </p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task);
          }}
          className="p-1 hover:bg-black/10 rounded transition-colors flex-shrink-0"
        >
          <Trash2 className="h-4 w-4 text-foreground/60" />
        </button>
      </div>

      {task.dueDate && (
        <div className="flex items-center gap-1 text-xs text-foreground/70">
          <Calendar className="h-3 w-3" />
          <span>{new Date(task.dueDate).toLocaleDateString('ko-KR')}</span>
        </div>
      )}
    </div>
  );
}
