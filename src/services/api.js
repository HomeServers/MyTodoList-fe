/**
 * API 서비스 - 백엔드 API와의 통신을 담당하는 함수들
 */

// API 기본 URL (환경 변수에서 가져오거나 기본값 사용)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

/**
 * 태스크 삭제 API 호출
 * @param {string} itemId - 삭제할 태스크 ID
 * @returns {Promise} - 삭제 결과 Promise
 */
export const deleteTask = async (itemId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/items/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // 서버 에러 응답 처리
      const errorData = await response.json().catch(() => ({
        message: `서버 오류 (${response.status})`,
      }));
      throw new Error(errorData.message || `삭제 실패 (${response.status})`);
    }

    return { success: true };
  } catch (error) {
    console.error('태스크 삭제 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 태스크 목록 조회 API 호출
 * @returns {Promise<Array>} - 태스크 목록 Promise
 */
export const fetchTasks = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/items`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`태스크 목록 조회 실패 (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error('태스크 목록 조회 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 태스크 추가 API 호출
 * @param {Object} taskData - 추가할 태스크 데이터
 * @returns {Promise<Object>} - 생성된 태스크 데이터 Promise
 */
export const createTask = async (taskData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error(`태스크 생성 실패 (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error('태스크 생성 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 태스크 수정 API 호출
 * @param {string} itemId - 수정할 태스크 ID
 * @param {Object} taskData - 수정할 태스크 데이터
 * @returns {Promise<Object>} - 수정된 태스크 데이터 Promise
 */
export const updateTask = async (itemId, taskData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/items/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error(`태스크 수정 실패 (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error('태스크 수정 중 오류 발생:', error);
    throw error;
  }
};
