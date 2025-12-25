const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const API_URL = API_BASE_URL + '/api';

// ========== Auth API ==========

export const signin = async (account, password) => {
  try {
    const response = await fetch(`${API_URL}/auths/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ account, password }),
    });

    if (response.status === 401) {
      throw new Error('아이디 또는 비밀번호가 올바르지 않습니다.');
    }

    if (!response.ok) {
      throw new Error('로그인 중 오류가 발생했습니다.');
    }

    const result = await response.json();
    return result.data; // accessToken
  } catch (error) {
    console.error('로그인 오류:', error);
    throw error;
  }
};

export const signup = async (account, password, name) => {
  try {
    const response = await fetch(`${API_URL}/auths/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ account, password, name }),
    });

    if (response.status === 409) {
      throw new Error('이미 존재하는 아이디입니다.');
    }

    if (!response.ok) {
      throw new Error('회원가입 중 오류가 발생했습니다.');
    }

    return await response.json();
  } catch (error) {
    console.error('회원가입 오류:', error);
    throw error;
  }
};

// ========== Task API ==========

export const fetchTasks = async (accessToken) => {
  try {
    const response = await fetch(`${API_URL}/items`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`태스크 목록 조회 실패 (${response.status})`);
    }

    const responseData = await response.json();
    return responseData.data || responseData;
  } catch (error) {
    console.error('태스크 목록 조회 오류:', error);
    throw error;
  }
};

export const createTask = async (taskData, accessToken) => {
  try {
    const response = await fetch(`${API_URL}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error(`태스크 생성 실패 (${response.status})`);
    }

    const responseData = await response.json();
    return responseData.data || responseData;
  } catch (error) {
    console.error('태스크 생성 오류:', error);
    throw error;
  }
};

export const updateTask = async (itemId, taskData, accessToken) => {
  try {
    const response = await fetch(`${API_URL}/items/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error(`태스크 수정 실패 (${response.status})`);
    }

    // 204 No Content인 경우 빈 객체 반환
    if (response.status === 204) {
      return { success: true };
    }

    // Content-Length가 0이거나 응답 본문이 없는 경우 처리
    const text = await response.text();
    if (!text) {
      return { success: true };
    }

    const responseData = JSON.parse(text);
    return responseData.data || responseData;
  } catch (error) {
    console.error('태스크 수정 오류:', error);
    throw error;
  }
};

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
      const errorData = await response.json().catch(() => ({
        message: `서버 오류 (${response.status})`,
      }));
      throw new Error(errorData.message || `삭제 실패 (${response.status})`);
    }

    return { success: true };
  } catch (error) {
    console.error('태스크 삭제 오류:', error);
    throw error;
  }
};

// ========== Import/Export API ==========

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
    console.error('Export 오류:', error);
    throw error;
  }
};

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
    console.error('Import 오류:', error);
    throw error;
  }
};
