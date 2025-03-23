import { useState, useEffect } from 'react';

const API_URL = 'https://api.todo.nuhgnod.site/api/items'; // 서버 API URL

export const useKanban = () => {
  const [tasks, setTasks] = useState({
    PENDING: [],
    IN_PROGRESS: [],
    COMPLETED: [],
  });

  // 1. 서버에서 데이터 가져오기
  const fetchTasks = async () => {
    console.log("🔥 API 호출 시작:", API_URL); // API URL 확인

    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();

      // 상태별로 태스크 분류
      const groupedTasks = {
        PENDING: data.filter((item) => item.status === 'PENDING'),
        IN_PROGRESS: data.filter((item) => item.status === 'IN_PROGRESS'),
        COMPLETED: data.filter((item) => item.status === 'COMPLETED'),
      };

      setTasks(groupedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // 2. 새로운 태스크 추가
  const addTask = async (status, content) => {
    const newTask = { content, status }; // 서버에서 ID(hash)를 생성

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) throw new Error('Failed to add task');
      
      const createdTask = await response.json(); // 서버가 생성한 아이템 응답 받기

      // UI 상태 업데이트
      setTasks((prevTasks) => ({
        ...prevTasks,
        [status]: [...prevTasks[status], createdTask], // 응답 받은 데이터를 추가
      }));
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // 3. 드래그 앤 드롭 처리
  const handleDragEnd = async (result) => {
    const { source, destination } = result;

    // 유효하지 않은 드래그
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // 드래그된 태스크 가져오기
    const sourceTasks = [...tasks[source.droppableId]];
    const [movedTask] = sourceTasks.splice(source.index, 1);

    // 상태 변경
    const destinationTasks = [...tasks[destination.droppableId]];
    movedTask.status = destination.droppableId; // 새로운 상태 설정
    destinationTasks.splice(destination.index, 0, movedTask);

    // 상태 업데이트
    setTasks({
      ...tasks,
      [source.droppableId]: sourceTasks,
      [destination.droppableId]: destinationTasks,
    });

    // 서버에 상태 업데이트 요청 (PUT)
    try {
      await fetch(`${API_URL}/${movedTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movedTask),
      });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    fetchTasks();
  }, []);

  return { tasks, handleDragEnd, addTask };
};
