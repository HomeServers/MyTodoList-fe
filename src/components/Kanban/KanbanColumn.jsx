import { Droppable } from '@hello-pangea/dnd';
import { KanbanCard } from './KanbanCard';
import { useState } from 'react';
import { PrimaryButton } from '../buttons/PrimaryButton';
import './styles/KanbanColumn.css';

export const KanbanColumn = ({ status, tasks, onAddTask, onOpenModal, onCardClick }) => {
  return (
    <Droppable droppableId={status}>
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="kanban-column"
        >
          {/* 컬럼 헤더 */}
          <div className="kanban-header">
            <h3 className="kanban-title">{status}</h3>
            {status === 'PENDING' && (
              <PrimaryButton onClick={() => onOpenModal(status)} ariaLabel="Add Task">
                ➕
              </PrimaryButton>
            )}
          </div>

          {/* 태스크 카드 영역 */}
          <div className="kanban-tasks">
            {tasks.map((task, index) => (
              <KanbanCard key={task.id || task.hash} task={task} index={index} onCardClick={onCardClick} />
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
};
