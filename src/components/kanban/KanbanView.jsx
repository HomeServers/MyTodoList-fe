import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import KanbanColumn from './KanbanColumn';
import { Button } from '../ui/button';
import { Plus, List as ListIcon } from 'lucide-react';
import TaskAddModal from '../modals/TaskAddModal';
import TaskDetailModal from '../modals/TaskDetailModal';
import TaskEditModal from '../modals/TaskEditModal';
import TaskDeleteConfirmModal from '../modals/TaskDeleteConfirmModal';
import TaskDragReactivateModal from '../modals/TaskDragReactivateModal';
import AlertModal from '../modals/AlertModal';

export default function KanbanView({
  tasks,
  onViewChange,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onMoveTask,
  loading,
  error,
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDragReactivateOpen, setIsDragReactivateOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [pendingDragInfo, setPendingDragInfo] = useState(null);

  const handleAddTask = () => {
    setIsAddModalOpen(true);
  };

  const handleCardClick = (task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (task) => {
    setSelectedTask(task);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async (task) => {
    await onDeleteTask(task.id);
  };

  const handleDragReactivate = async (newDueDate) => {
    if (!newDueDate || !pendingDragInfo || !selectedTask) return;

    const d = new Date(newDueDate);
    d.setHours(23, 59, 59, 999);

    // 마감일과 상태 업데이트
    await onUpdateTask({
      ...selectedTask,
      status: pendingDragInfo.toStatus,
      dueDate: d.toISOString(),
    });

    // 모달 닫기 및 상태 초기화
    setIsDragReactivateOpen(false);
    setPendingDragInfo(null);
    setSelectedTask(null);
  };

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    // EXPIRED 컬럼으로는 드래그 불가
    if (destination.droppableId === 'EXPIRED') {
      return;
    }

    // EXPIRED 컬럼에서는 PENDING 또는 IN_PROGRESS로만 이동 가능 (재활성화 필요)
    if (source.droppableId === 'EXPIRED') {
      // COMPLETED로는 이동 불가
      if (destination.droppableId === 'COMPLETED') {
        setIsAlertOpen(true);
        return;
      }

      const numericTaskId = typeof draggableId === 'string' ? parseInt(draggableId, 10) : draggableId;
      const task = tasks.EXPIRED.find((t) => t.id === numericTaskId);

      if (task) {
        setSelectedTask(task);
        setPendingDragInfo({
          taskId: draggableId,
          fromStatus: source.droppableId,
          toStatus: destination.droppableId,
          index: destination.index,
        });
        setIsDragReactivateOpen(true);
      }
      return;
    }

    onMoveTask(draggableId, source.droppableId, destination.droppableId, destination.index);
  };

  if (loading && !tasks) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-destructive">에러: {error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 border-b bg-background">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">칸반 보드</h1>
              <p className="text-sm text-muted-foreground mt-1">
                태스크를 드래그하여 상태를 변경하세요
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={() => onViewChange?.('list')} variant="outline" size="sm">
                <ListIcon className="h-4 w-4 mr-2" />
                리스트 뷰
              </Button>
              <Button onClick={handleAddTask} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                새 태스크
              </Button>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-x-auto p-8">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-6 h-full">
              {Object.keys(tasks).map((status) => (
                <KanbanColumn
                  key={status}
                  status={status}
                  tasks={tasks[status]}
                  onAddTask={handleAddTask}
                  onCardClick={handleCardClick}
                  onDeleteTask={handleDeleteClick}
                />
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>

      {/* Modals */}
      <TaskAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={onAddTask}
      />

      <TaskDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        task={selectedTask}
        onEdit={handleEdit}
        onDelete={(task) => {
          setIsDetailModalOpen(false);
          handleDeleteClick(task);
        }}
      />

      <TaskEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        task={selectedTask}
        onConfirm={onUpdateTask}
      />

      <TaskDeleteConfirmModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        task={selectedTask}
        onConfirm={handleDeleteConfirm}
      />

      <TaskDragReactivateModal
        isOpen={isDragReactivateOpen}
        onClose={() => {
          setIsDragReactivateOpen(false);
          setPendingDragInfo(null);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onConfirm={handleDragReactivate}
      />

      <AlertModal
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        title="완료로 이동 불가"
        message="만료된 태스크는 완료 상태로 변경할 수 없습니다. 대기 또는 진행중 상태로 재활성화할 수 있습니다."
      />
    </>
  );
}
