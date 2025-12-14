/**
 * API 서비스 - 백엔드 API와의 통신을 담당하는 함수들
 */

// API 기본 URL (환경 변수에서 가져오거나 기본값 사용)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const API_URL = API_BASE_URL + "/api"

/**
 * 태스크 삭제 API 호출
 * @param {string} itemId - 삭제할 태스크 ID
 * @param {string} [accessToken] - 사용자 인증 토큰
 * @returns {Promise} - 삭제 결과 Promise
 */
export const deleteTask = async (itemId, accessToken) => {
  try {
    const response = await fetch(`${API_URL}/items/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
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
    const response = await fetch(`${API_URL}/items`, {
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
    const response = await fetch(`${API_URL}/items`, {
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
    const response = await fetch(`${API_URL}/items/${itemId}`, {
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

/**
 * 모든 태스크를 .ics 파일로 export
 * @param {string} accessToken - 사용자 인증 토큰
 * @returns {Promise} - export 성공 여부
 */
export const exportToIcs = async (accessToken) => {
  try {
    const response = await fetch(`${API_URL}/items/export.ics`, {
      method: 'GET',
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Export 실패 (${response.status})`);
    }

    // Blob으로 변환하여 파일 다운로드
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mytodolist_${new Date().toISOString().split('T')[0]}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.error('Export 중 오류 발생:', error);
    throw error;
  }
};

/**
 * .ics 파일에서 태스크 import
 * @param {File} file - import할 .ics 파일
 * @param {string} accessToken - 사용자 인증 토큰
 * @returns {Promise<Object>} - import 결과 { imported, failed, total }
 */
export const importFromIcs = async (file, accessToken) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/items/import`, {
      method: 'POST',
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Import 실패 (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error('Import 중 오류 발생:', error);
    throw error;
  }
};
