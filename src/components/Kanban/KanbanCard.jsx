import { Draggable } from '@hello-pangea/dnd';

export const KanbanCard = ({ task, index }) => (
  <Draggable draggableId={task.id} index={index}>
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className="kanban-card"
        style={{
          ...provided.draggableProps.style,
          padding: '12px',
          margin: '8px 0',
          background: '#fff',
          borderRadius: '6px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        {task.content}
      </div>
    )}
  </Draggable>
);