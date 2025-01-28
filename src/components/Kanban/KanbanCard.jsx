import { Draggable } from '@hello-pangea/dnd';
import './styles/KanbanCard.css'; // 카드 스타일 적용

export const KanbanCard = ({ task, index }) => (
  <Draggable draggableId={task.hash} index={index}>
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className="kanban-card"
      >
        {task.content} {/* 카드 내용 */}
      </div>
    )}
  </Draggable>
);
