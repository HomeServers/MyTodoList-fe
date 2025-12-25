import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import KanbanColumn from './KanbanColumn';
import { Button } from '../ui/button';
import { Plus, List as ListIcon } from 'lucide-react';
import TaskAddModal from '../modals/TaskAddModal';
import TaskDetailModal from '../modals/TaskDetailModal';
import TaskEditModal from '../modals/TaskEditModal';

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
  const [selectedTask, setSelectedTask] = useState(null);

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

  const handleDelete = async (task) => {
    await onDeleteTask(task.id);
  };

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
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
                  onDeleteTask={handleDelete}
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
        onDelete={handleDelete}
      />

      <TaskEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        task={selectedTask}
        onConfirm={onUpdateTask}
      />
    </>
  );
}
