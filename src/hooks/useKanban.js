import { useState } from 'react';
import { INITIAL_TASKS } from '../constants/tasks';

export const useKanban = () => {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    setTasks((prev) => {
      const newTasks = { ...prev };

      if (source.droppableId === destination.droppableId) {
        const items = [...newTasks[source.droppableId]];
        const [moved] = items.splice(source.index, 1);
        items.splice(destination.index, 0, moved);
        newTasks[source.droppableId] = items;
        return newTasks;
      }

      const sourceItems = [...newTasks[source.droppableId]];
      const destItems = [...newTasks[destination.droppableId]];
      const [moved] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, moved);

      return {
        ...newTasks,
        [source.droppableId]: sourceItems,
        [destination.droppableId]: destItems,
      };
    });
  };

  return { tasks, handleDragEnd };
};