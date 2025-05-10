import { useKanban } from './hooks/useKanban';
import { KanbanBoard } from './components/Kanban/KanbanBoard';
import './components/buttons/styles/buttons.css';

export default function App() {
  const { tasks, handleDragEnd, addTask, updateTask } = useKanban();

  return (
    <KanbanBoard 
      tasks={tasks} 
      onDragEnd={handleDragEnd}
      onAddTask={addTask}
      onUpdateTask={updateTask}
    />
  );
}