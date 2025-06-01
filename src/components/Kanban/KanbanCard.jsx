import { Draggable } from '@hello-pangea/dnd';
import './styles/KanbanCard.css'; // 카드 스타일 적용
import { useState } from 'react';

export const KanbanCard = ({ task, index, onCardClick, onDeleteClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Draggable draggableId={task.hash} index={index}>
      {(provided, snapshot) => {
        const isDragging = snapshot.isDragging;
        
        // 라이브러리가 제공하는 스타일을 그대로 사용
        // 중요: 이 스타일은 드래그 중 위치 계산을 정확하게 처리하는 로직을 포함함
        const style = {
          ...provided.draggableProps.style,
          cursor: isDragging ? 'grabbing' : 'pointer',
          boxShadow: isDragging ? '0 8px 20px rgba(0, 0, 0, 0.2)' : undefined,
          // 드래그 중이 아니면 트랜지션 적용
          transition: isDragging ? undefined : 'box-shadow 0.2s, background 0.2s',
        };
        
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
            onClick={(e) => {
              // 드래그 중 클릭 이벤트 무시
              if (e.detail === 0) return;
              if (typeof onCardClick === 'function') onCardClick(task);
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={style}
          >
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
          {/* 삭제 버튼 - 호버 시에만 표시 */}
          {isHovered && onDeleteClick && (
            <button 
              className="delete-button"
              onClick={(e) => {
                e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
                onDeleteClick(task);
              }}
              aria-label="Delete task"
            >
              ×
            </button>
          )}
          </div>
        );
      }}
    </Draggable>
  );
};
