import { DragDropContext } from '@hello-pangea/dnd';
import { KanbanColumn } from './KanbanColumn';
import TaskInputModal from '../Modal/TaskInputModal';
import { useState } from 'react';
import './styles/KanbanBoard.css'

export const KanbanBoard = ({ tasks, onDragEnd, onAddTask }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(null);

  const handleOpenModal = (status) => {
    setCurrentStatus(status);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddTask = (taskObj) => {
    if (currentStatus) {
      // taskObj: { content, dueDate }
      onAddTask(currentStatus, taskObj);
    }
    setIsModalOpen(false);
  };

  return (
    <>
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
              onAddTask={onAddTask}
              onOpenModal={handleOpenModal}
            />
          ))}
        </div>
      </DragDropContext>

      {/* 모달은 KanbanBoard 최상위 레벨에서 렌더링 */}
      <TaskInputModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleAddTask}
      />
    </>
  );
};