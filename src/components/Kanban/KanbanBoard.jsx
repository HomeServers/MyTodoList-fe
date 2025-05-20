import { DragDropContext } from '@hello-pangea/dnd';
import { KanbanColumn } from './KanbanColumn';
import TaskInputModal from '../Modal/TaskInputModal';
import TaskDetailModal from '../Modal/TaskDetailModal';
import ConfirmDeleteModal from '../Modal/ConfirmDeleteModal';
import { useState } from 'react';
import './styles/KanbanBoard.css'

export const KanbanBoard = ({ tasks, onDragEnd, onAddTask, onUpdateTask, onDeleteTask }) => {
  // EXPIRED 칸반으로 이동, EXPIRED 칸반에서 이동 모두 불가
  // 실제 이동 애니메이션 및 상태 갱신은 useKanban의 handleDragEnd에서 처리됨
  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === 'EXPIRED' || destination.droppableId === 'EXPIRED') {
      return;
    }
    // props로 받은 onDragEnd가 useKanban의 handleDragEnd여야 함
    if (typeof onDragEnd === 'function') {
      onDragEnd(result);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [detailTask, setDetailTask] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

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

  // 카드 클릭 시 상세 모달 열기
  const handleCardClick = (task) => {
    setDetailTask(task);
    setIsDetailOpen(true);
  };
  const handleCloseDetailModal = () => {
    setIsDetailOpen(false);
    setDetailTask(null);
  };

  // 삭제 버튼 클릭 시 확인 모달 열기
  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  // 삭제 확인 모달 닫기
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  // 삭제 확인 시 실제 삭제 처리
  const handleConfirmDelete = () => {
    if (taskToDelete && onDeleteTask) {
      onDeleteTask(taskToDelete);
    }
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
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
              onCardClick={handleCardClick}
              onDeleteClick={handleDeleteClick}
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
      <TaskDetailModal
        task={detailTask}
        isOpen={isDetailOpen}
        onClose={handleCloseDetailModal}
        onEdit={(editedTask) => {
          if (onUpdateTask) onUpdateTask(editedTask);
          setIsDetailOpen(false);
          setDetailTask(null);
        }}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        taskTitle={taskToDelete?.content || ''}
      />
    </>
  );
};