import { useKanban } from './hooks/useKanban';
import { KanbanBoard } from './components/Kanban/KanbanBoard';
import './components/buttons/styles/buttons.css';
import './styles/theme.css'; // 숲속 테마 스타일 추가

export default function App() {
  const { tasks, handleDragEnd, addTask } = useKanban();


  return (
    <div className="forest-theme">
      <header className="app-header">
        <h1>🌲 숲속 할 일 관리 🌲</h1>
      </header>
      <KanbanBoard 
        tasks={tasks} 
        onDragEnd={handleDragEnd}
        onAddTask={addTask}  // ✅ addTask 전달
      />
      <footer className="app-footer">
        <p>🍃 평화로운 숲속에서 할 일을 관리하세요 🍃</p>
      </footer>
    </div>
  );
}