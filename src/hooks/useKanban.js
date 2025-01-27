import { useState } from 'react'; // useState 임포트 추가
import { INITIAL_TASKS } from '../constants/tasks'; // INITIAL_TASKS 임포트 추가

export const useKanban = () => {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [newTaskContent, setNewTaskContent] = useState('');

  // 드래그 앤 드롭 핸들러
  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    setTasks((prevTasks) => {
      const newTasks = { ...prevTasks };

      // 같은 컬럼 내 이동
      if (source.droppableId === destination.droppableId) {
        const items = [...newTasks[source.droppableId]];
        const [movedItem] = items.splice(source.index, 1);
        items.splice(destination.index, 0, movedItem);
        newTasks[source.droppableId] = items;
        return newTasks;
      }

      // 다른 컬럼으로 이동
      const sourceItems = [...newTasks[source.droppableId]];
      const destItems = [...newTasks[destination.droppableId]];
      const [movedItem] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, movedItem);

      return {
        ...newTasks,
        [source.droppableId]: sourceItems,
        [destination.droppableId]: destItems,
      };
    });
  };

  // 할 일 추가 로직
  const addTask = (status, content) => {
    if (!content.trim()) return;

    setTasks((prev) => ({
      ...prev,
      [status]: [
        ...prev[status],
        { 
          id: Date.now().toString(), // 고유 ID 생성
          content: content.trim() 
        }
      ]
    }));
  };

  return { tasks, handleDragEnd, addTask };
};