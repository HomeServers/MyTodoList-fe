import { Droppable } from '@hello-pangea/dnd';
import { KanbanCard } from './KanbanCard';
import { useState } from 'react';
import { PrimaryButton } from '../buttons/PrimaryButton';
import './styles/KanbanColumn.css';

export const KanbanColumn = ({ status, tasks, onAddTask, onOpenModal, className }) => {
  // 상태에 따른 제목 매핑
  const statusTitles = {
    'PENDING': '🌱 시작 전',
    'IN_PROGRESS': '🌿 진행 중',
    'COMPLETED': '🌳 완료됨'
  };

  return (
    <Droppable droppableId={status}>
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={`kanban-column ${status.toLowerCase()} ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
        >
          {/* 컬럼 헤더 */}
          <div className="kanban-header">
            <h3 className="kanban-title">{statusTitles[status] || status}</h3>
            {status === 'PENDING' && (
              <PrimaryButton onClick={() => onOpenModal(status)} ariaLabel="Add Task">
                🌱
              </PrimaryButton>
            )}
          </div>

          {/* 태스크 카드 영역 */}
          <div className={`kanban-column-content ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}>
            {tasks.map((task, index) => (
              <KanbanCard 
                key={task.id || task.hash} 
                task={task} 
                index={index} 
                status={status.toLowerCase()}
              />
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
};
