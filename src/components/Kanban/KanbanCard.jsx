import { Draggable } from '@hello-pangea/dnd';
import './styles/KanbanCard.css'; // 카드 스타일 적용

export const KanbanCard = ({ task, index, onCardClick }) => (
  <Draggable draggableId={task.hash} index={index}>
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={
          "kanban-card" + (task.status === 'EXPIRED' ? ' expired-card' : '')
        }
        onClick={(e) => {
          // 드래그 중 클릭 이벤트 무시
          if (e.detail === 0) return;
          if (typeof onCardClick === 'function') onCardClick(task);
        }}
        style={{ cursor: 'pointer' }}
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
      </div>
    )}
  </Draggable>
);


