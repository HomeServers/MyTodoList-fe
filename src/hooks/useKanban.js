import { useState, useEffect } from 'react';

// API URL을 환경 변수로 관리하되, 기본값으로 프로덕션 URL 사용
const API_URL = process.env.REACT_APP_API_URL || 'https://api.todo.nuhgnod.site/api/items';

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

    // 유효하지 않은 드래그 (목적지가 없는 경우)
    if (!destination) return;
    
    // 동일 칸반 내 이동인 경우 (같은 droppableId)
    if (source.droppableId === destination.droppableId) {
      console.log('동일 칸반 내 이동은 현재 지원되지 않습니다.');
      // 동일 칸반 내 이동은 서버 업데이트 없이 무시
      return;
    }
    
    // 서로 다른 칸반 간 이동인 경우
    try {
      // 원본 데이터 복사 (불변성 유지)
      const sourceTasks = [...tasks[source.droppableId]];
      const destinationTasks = [...tasks[destination.droppableId]];
      
      // 이동할 태스크 가져오기 (깊은 복사)
      const taskToMove = JSON.parse(JSON.stringify(sourceTasks[source.index]));
      
      // 원본에서 태스크 제거
      sourceTasks.splice(source.index, 1);
      
      // 새로운 상태 설정
      taskToMove.status = destination.droppableId;
      
      // 목적지에 태스크 추가
      destinationTasks.splice(destination.index, 0, taskToMove);
      
      // 낙관적 UI 업데이트 (API 응답 전)
      setTasks({
        ...tasks,
        [source.droppableId]: sourceTasks,
        [destination.droppableId]: destinationTasks,
      });
      
      // 서버에 상태 업데이트 요청 (PUT)
      const response = await fetch(`${API_URL}/${taskToMove.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskToMove),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update task status');
      }
      
      // 서버 요청 성공 후 최신 데이터로 전체 목록 다시 가져오기
      console.log('서버 업데이트 성공, 최신 데이터 가져오기');
      await fetchTasks();
      
    } catch (error) {
      console.error('Error updating task status:', error);
      // 에러 발생 시 최신 데이터로 다시 가져오기
      console.log('에러 발생, 최신 데이터 가져오기');
      await fetchTasks();
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    fetchTasks();
  }, []);

  return { tasks, handleDragEnd, addTask };
};
