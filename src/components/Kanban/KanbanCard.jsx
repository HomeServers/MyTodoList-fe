import { Draggable } from '@hello-pangea/dnd';
import './styles/KanbanCard.css'; // 카드 스타일 적용
import { useState } from 'react';

export const KanbanCard = ({ task, index, onCardClick, onDelete }) => (
  <Draggable draggableId={task.hash} index={index}>
    {(provided, snapshot) => {
      const isDragging = snapshot.isDragging;
      return (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={
            "kanban-card" +
            (task.status === 'EXPIRED' ? ' expired-card' : '') +
            (isDragging ? ' dragging' : '')
          }
          style={{
            cursor: isDragging ? 'grabbing' : 'pointer',
            boxShadow: isDragging ? '0 4px 16px 0 rgba(0,0,0,0.18)' : undefined,
            zIndex: isDragging ? 10 : undefined,
            background: isDragging ? 'var(--color-green-100,#e6f4ea)' : undefined,
            transition: 'box-shadow 0.2s, background 0.2s',
            ...provided.draggableProps.style,
            position: 'relative', // 삭제 버튼 위치 지정을 위해 추가
          }}
        >
          <div className="card-content-wrapper" onClick={(e) => {
            // 드래그 중 클릭 이벤트 무시
            if (e.detail === 0) return;
            if (typeof onCardClick === 'function') onCardClick(task);
          }}>
            <div className={task.status === 'EXPIRED' ? "expired-content" : undefined}>
              {task.content}
            </div>
            {task.dueDate && (
              <div
                className={
                  task.status === 'EXPIRED'
                    ? 'expired-due-badge'
                    : 'due-badge'
                }
              >
              <span role="img" aria-label="calendar">📅</span>
              {(() => {
                // YYYY-MM-DD만 추출
                try {
                  const d = new Date(task.dueDate);
                  if (!isNaN(d)) {
                    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
                  }
                } catch {}
                if (typeof task.dueDate === 'string') {
                  return task.dueDate.slice(0,10);
                }
                return task.dueDate;
              })()}
              </div>
            )}
          </div>
          
          {/* 삭제 버튼 */}
          <button 
            className="delete-button" 
            onClick={(e) => {
              e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
              if (typeof onDelete === 'function') onDelete(task);
            }}
            aria-label="Delete task"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      );
    }}
  </Draggable>
);
