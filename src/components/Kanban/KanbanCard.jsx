import { Draggable } from '@hello-pangea/dnd';
import './styles/KanbanCard.css'; // 카드 스타일 적용

export const KanbanCard = ({ task, index, status }) => (
  <Draggable draggableId={task.hash || task.id} index={index}>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={`kanban-card ${status || task.status?.toLowerCase()} ${snapshot.isDragging ? 'is-dragging' : ''}`}
      >
        <div className="kanban-card-title">{task.title || task.content}</div>
        {task.description && (
          <div className="kanban-card-description">{task.description}</div>
        )}
        <div className="kanban-card-footer">
          {task.dueDate && (
            <div className="kanban-card-date">{new Date(task.dueDate).toLocaleDateString()}</div>
          )}
          {task.priority && (
            <div className={`kanban-card-priority ${task.priority.toLowerCase()}`}>
              {task.priority}
            </div>
          )}
        </div>
      </div>
    )}
  </Draggable>
);
