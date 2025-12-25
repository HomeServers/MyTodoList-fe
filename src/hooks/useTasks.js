import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';

export default function useTasks(accessToken) {
  const [tasks, setTasks] = useState({
    PENDING: [],
    IN_PROGRESS: [],
    COMPLETED: [],
    EXPIRED: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 태스크 목록 조회
  const loadTasks = useCallback(async () => {
    if (!accessToken) return;

    setLoading(true);
    setError(null);

    try {
      const taskList = await api.fetchTasks(accessToken);

      // 상태별로 분류
      const groupedTasks = {
        PENDING: taskList.filter((item) => item.status === 'PENDING'),
        IN_PROGRESS: taskList.filter((item) => item.status === 'IN_PROGRESS'),
        COMPLETED: taskList.filter((item) => item.status === 'COMPLETED'),
        EXPIRED: taskList.filter((item) => item.status === 'EXPIRED'),
      };

      setTasks(groupedTasks);
    } catch (err) {
      setError(err.message);
      console.error('태스크 로드 오류:', err);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  // 태스크 생성
  const addTask = useCallback(async ({ content, dueDate, status = 'PENDING' }) => {
    const newTask = { content, status };
    if (dueDate) newTask.dueDate = dueDate;

    try {
      const createdTask = await api.createTask(newTask, accessToken);
      const taskStatus = createdTask.status || status;

      setTasks((prevTasks) => ({
        ...prevTasks,
        [taskStatus]: [...prevTasks[taskStatus], createdTask],
      }));

      return createdTask;
    } catch (err) {
      setError(err.message);
      console.error('태스크 추가 오류:', err);
      throw err;
    }
  }, [accessToken]);

  // 태스크 수정
  const updateTaskItem = useCallback(async (editedTask) => {
    if (!editedTask || !editedTask.id) return;

    try {
      await api.updateTask(editedTask.id, editedTask, accessToken);
      await loadTasks(); // 전체 다시 로드
    } catch (err) {
      setError(err.message);
      console.error('태스크 수정 오류:', err);
      throw err;
    }
  }, [accessToken, loadTasks]);

  // 태스크 삭제
  const deleteTaskItem = useCallback(async (taskIdOrTask) => {
    const taskId = typeof taskIdOrTask === 'object' ? taskIdOrTask.id : taskIdOrTask;

    if (!taskId) return;

    try {
      await api.deleteTask(taskId, accessToken);

      // 전체 tasks에서 해당 id를 가진 task 찾아서 삭제
      setTasks((prevTasks) => {
        const newTasks = { ...prevTasks };
        Object.keys(newTasks).forEach((status) => {
          newTasks[status] = newTasks[status].filter((task) => task.id !== taskId);
        });
        return newTasks;
      });
    } catch (err) {
      setError(err.message);
      console.error('태스크 삭제 오류:', err);
      throw err;
    }
  }, [accessToken]);

  // 드래그앤드롭으로 상태 변경
  const moveTask = useCallback(async (taskId, fromStatus, toStatus, newIndex) => {
    // UI 먼저 업데이트 (낙관적 업데이트)
    setTasks((prevTasks) => {
      const sourceTasks = [...prevTasks[fromStatus]];
      const taskIndex = sourceTasks.findIndex((t) => t.id === taskId);

      if (taskIndex === -1) return prevTasks;

      const [movedTask] = sourceTasks.splice(taskIndex, 1);
      const updatedTask = { ...movedTask, status: toStatus };

      if (fromStatus === toStatus) {
        // 같은 컬럼 내 이동
        sourceTasks.splice(newIndex, 0, updatedTask);
        return {
          ...prevTasks,
          [fromStatus]: sourceTasks,
        };
      } else {
        // 다른 컬럼으로 이동
        const destinationTasks = [...prevTasks[toStatus]];
        destinationTasks.splice(newIndex, 0, updatedTask);

        return {
          ...prevTasks,
          [fromStatus]: sourceTasks,
          [toStatus]: destinationTasks,
        };
      }
    });

    // 서버에 업데이트
    try {
      const taskToUpdate = tasks[fromStatus].find((t) => t.id === taskId);
      if (taskToUpdate) {
        await api.updateTask(taskId, { ...taskToUpdate, status: toStatus }, accessToken);
      }
    } catch (err) {
      setError(err.message);
      console.error('태스크 이동 오류:', err);
      // 실패 시 다시 로드
      await loadTasks();
    }
  }, [tasks, accessToken, loadTasks]);

  // 초기 로드
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return {
    tasks,
    loading,
    error,
    loadTasks,
    addTask,
    updateTask: updateTaskItem,
    deleteTask: deleteTaskItem,
    moveTask,
  };
}
