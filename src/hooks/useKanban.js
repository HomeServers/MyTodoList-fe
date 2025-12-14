import { useState, useEffect } from 'react';
import { deleteTask as apiDeleteTask } from '../services/api';

const BASE_URL = process.env.REACT_APP_API_URL || 'https://api.todo.nuhgnod.site'; // 서버 API URL 
const API_URL = BASE_URL + "/api/items"

export const useKanban = (accessToken) => {
  const [tasks, setTasks] = useState({
    PENDING: [],
    IN_PROGRESS: [],
    COMPLETED: [],
    EXPIRED: [],
  });

  // 태스크 수정 (내용/마감일)
  const updateTask = async (editedTask) => {
    if (!editedTask || !editedTask.id) return;
    try {
      // 서버에 PUT 요청
      const response = await fetch(`${API_URL}/${editedTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(editedTask),
      });
      
      if (!response.ok) throw new Error('Failed to update task');
      
      const responseData = await response.json();
      console.log('Updated task response:', responseData); // 디버깅용 로그
      
      // 서버에서 최신 데이터로 동기화
      await fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // 1. 서버에서 데이터 가져오기
  const fetchTasks = async () => {
    console.log("🔥 API 호출 시작:", API_URL); // API URL 확인

    try {
      const response = await fetch(API_URL, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      });
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const responseData = await response.json();
      
      // API 응답이 data 객체로 감싸져 있는지 확인
      const taskList = responseData.data ? responseData.data : responseData;
      
      console.log('Fetched tasks:', taskList); // 디버깅용 로그

      // 상태별로 태스크 분류
      const groupedTasks = {
        PENDING: taskList.filter((item) => item.status === 'PENDING'),
        IN_PROGRESS: taskList.filter((item) => item.status === 'IN_PROGRESS'),
        COMPLETED: taskList.filter((item) => item.status === 'COMPLETED'),
        EXPIRED: taskList.filter((item) => item.status === 'EXPIRED'),
      };

      setTasks(groupedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // 2. 새로운 태스크 추가
  const addTask = async (status, { content, dueDate }) => {
    const newTask = { content, status };
    if (dueDate) newTask.dueDate = dueDate;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) throw new Error('Failed to add task');
      
      const responseData = await response.json(); // 서버가 생성한 아이템 응답 받기
      
      // API 응답이 data 객체로 감싸져 있는지 확인
      const createdTask = responseData.data ? responseData.data : responseData;
      
      console.log('Created task:', createdTask); // 디버깅용 로그

      // UI 상태 업데이트 - 서버에서 받은 상태값을 사용
      const taskStatus = createdTask.status || status; // 서버 응답의 상태값 사용, 없으면 원래 상태값 사용
      
      setTasks((prevTasks) => {
        console.log('Previous tasks:', prevTasks);
        console.log(`Adding task to ${taskStatus} column:`, createdTask);
        
        return {
          ...prevTasks,
          [taskStatus]: [...prevTasks[taskStatus], createdTask], // 응답 받은 데이터를 추가
        };
      });
      
      // 상태 업데이트 확인 로그
      console.log('Tasks after update:', tasks);
      
      // 성공 피드백
      console.log('Task created successfully:', createdTask.id);
      
      return createdTask; // 생성된 태스크 반환
    } catch (error) {
      console.error('Error adding task:', error);
      return null;
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
    const taskCopy = { ...movedTask }; // 태스크 복사본 생성

    // 상태 변경
    const destinationTasks = [...tasks[destination.droppableId]];
    taskCopy.status = destination.droppableId; // 새로운 상태 설정
    
    // 같은 칸반 내에서의 이동인 경우 특별 처리
    if (source.droppableId === destination.droppableId) {
      // 같은 칸반 내 이동은 순서만 바꾸고 상태는 변경하지 않음
      destinationTasks.splice(destination.index, 0, taskCopy);
      
      // 상태 업데이트 (같은 칸반 내에서만 변경)
      setTasks({
        ...tasks,
        [source.droppableId]: destinationTasks,
      });
    } else {
      // 다른 칸반으로 이동하는 경우
      destinationTasks.splice(destination.index, 0, taskCopy);
      
      // 상태 업데이트 (소스와 대상 칸반 모두 변경)
      setTasks({
        ...tasks,
        [source.droppableId]: sourceTasks,
        [destination.droppableId]: destinationTasks,
      });
    }

    // 서버에 상태 업데이트 요청 (PUT)
    try {
      console.log('Sending task update to server:', taskCopy); // 디버깅용 로그
      
      const response = await fetch(`${API_URL}/${taskCopy.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(taskCopy),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update task status');
      }
      
      const responseData = await response.json();
      // API 응답이 data 객체로 감싸져 있는지 확인
      const updatedTask = responseData.data ? responseData.data : responseData;
      console.log('Task status updated:', updatedTask); // 디버깅용 로그
      
      // 서버 응답에 오류가 있으면 전체 데이터 다시 가져오기
      if (!updatedTask || !updatedTask.id) {
        console.log('Server response invalid, refreshing all tasks');
        await fetchTasks();
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      // 오류 발생 시 전체 데이터 다시 가져오기
      await fetchTasks();
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    fetchTasks();
  }, []);

  // 4. 태스크 삭제 처리
  const deleteTask = async (taskToDelete) => {
    if (!taskToDelete || !taskToDelete.id) return;
    
    try {
      // 서버에 DELETE 요청 (인증 토큰 포함)
      await apiDeleteTask(taskToDelete.id, accessToken);
      
      // UI 상태 업데이트 (삭제된 태스크 제거)
      setTasks((prevTasks) => ({
        ...prevTasks,
        [taskToDelete.status]: prevTasks[taskToDelete.status].filter(task => task.id !== taskToDelete.id),
      }));
      
      // 삭제 성공 피드백
      console.log(`Task ${taskToDelete.id} deleted successfully`);
    } catch (error) {
      console.error('Error deleting task:', error);
      // 실패 시 오류 처리
      alert(`태스크 삭제 중 오류가 발생했습니다: ${error.message}`);

    }
  };

  return { tasks, handleDragEnd, addTask, updateTask, deleteTask, fetchTasks };
};
