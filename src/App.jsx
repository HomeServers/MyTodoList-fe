import { useKanban } from './hooks/useKanban';
import { KanbanBoard } from './components/Kanban/KanbanBoard';

export default function App() {
  const { tasks, handleDragEnd, addTask } = useKanban();


  return (
    <KanbanBoard 
      tasks={tasks} 
      onDragEnd={handleDragEnd}
      onAddTask={addTask}  // ✅ addTask 전달
    />
  );
}