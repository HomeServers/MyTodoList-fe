import { Droppable } from '@hello-pangea/dnd';
import { KanbanCard } from './KanbanCard';

export const KanbanColumn = ({ status, tasks }) => (
  <Droppable droppableId={status}>
    {(provided) => (
      <div
        {...provided.droppableProps}
        ref={provided.innerRef}
        className="kanban-column"
        style={{
          width: '320px',
          background: '#f8f9fa',
          borderRadius: '8px',
          padding: '16px'
        }}
      >
        <h3 style={{ margin: '0 0 12px', fontSize: '1.2rem' }}>{status}</h3>
        {tasks.map((task, index) => (
          <KanbanCard key={task.id} task={task} index={index} />
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
);