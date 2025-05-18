import React, { useState } from 'react';
import './LoginPage.css';
import SignupModal from './SignupModal';

function LoginPage({ onLogin }) {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  // 칸반보드와 동일한 API host 사용
  const BASE_URL = process.env.REACT_APP_API_URL || 'https://api.todo.nuhgnod.site';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!account || !password) {
      setError('아이디와 비밀번호를 모두 입력하세요.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/auths/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account, password })
      });
      if (response.status === 401) {
        setError('아이디 또는 비밀번호가 올바르지 않습니다.');
        setLoading(false);
        return;
      }
      if (response.ok) {
        const result = await response.json();
        if (result && result.data && typeof result.data === 'string') {
          if (onLogin) onLogin({ account, accessToken: result.data });
        } else {
          setError('로그인 응답에 accessToken이 없습니다.');
        }
      } else {
        setError('로그인 중 알 수 없는 오류가 발생했습니다.');
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>로그인</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="account">아이디</label>
          <input
            id="account"
            type="text"
            value={account}
            onChange={e => setAccount(e.target.value)}
            placeholder="아이디를 입력하세요"
            autoComplete="username"
          />
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            autoComplete="current-password"
          />
          {error && <div className="login-error">{error}</div>}
          <div style={{display:'flex', gap:'0.5rem', marginTop:'0.5rem'}}>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? '로그인 중...' : '로그인'}
            </button>
            <button type="button" className="login-btn" style={{background:'#bdbdbd'}} onClick={()=>setSignupOpen(true)} disabled={loading}>
              회원가입
            </button>
          </div>
        </form>
      </div>
      <SignupModal isOpen={signupOpen} onClose={()=>setSignupOpen(false)} onSignup={onLogin} />
    </div>
  );
}

export default LoginPage;
