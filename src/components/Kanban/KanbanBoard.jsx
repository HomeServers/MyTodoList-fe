import { DragDropContext } from '@hello-pangea/dnd';
import { KanbanColumn } from './KanbanColumn';
import './styles/KanbanBoard.css'

export const KanbanBoard = ({ tasks, onDragEnd, onAddTask }) => (
  <DragDropContext onDragEnd={onDragEnd}>
    <div
    style={{ 
      display: 'flex', 
      gap: '24px', 
      padding: '20px',
      minHeight: '100vh',
      backgroundColor: '#f1f3f5'
    }}>
      {Object.keys(tasks).map((status) => (
        <KanbanColumn 
          key={status} 
          status={status} 
          tasks={tasks[status]} 
          onAddTask={onAddTask}  // ✅ onAddTask 전달
        />
      ))}
    </div>
  </DragDropContext>
);