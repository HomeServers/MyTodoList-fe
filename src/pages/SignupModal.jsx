import React, { useState } from 'react';
import './LoginPage.css';

function SignupModal({ isOpen, onClose, onSignup }) {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const BASE_URL = process.env.REACT_APP_API_URL || 'https://api.todo.nuhgnod.site';

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!account || !password || !name) {
      setError('모든 항목을 입력하세요.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/auths/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account, password, name })
      });
      if (response.status === 409) {
        setError('이미 존재하는 아이디입니다.');
        setLoading(false);
        return;
      }
      if (response.ok) {
        if (onSignup) onSignup(account);
        onClose();
      } else {
        setError('회원가입 중 오류가 발생했습니다.');
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" style={{position: 'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(0,0,0,0.15)', zIndex: 1000}}>
      <div className="login-container">
        <h2>회원가입</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="signup-account">아이디</label>
          <input
            id="signup-account"
            type="text"
            value={account}
            onChange={e => setAccount(e.target.value)}
            placeholder="아이디를 입력하세요"
            autoComplete="username"
          />
          <label htmlFor="signup-password">비밀번호</label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            autoComplete="new-password"
          />
          <label htmlFor="signup-name">이름</label>
          <input
            id="signup-name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="이름을 입력하세요"
            autoComplete="name"
          />
          {error && <div className="login-error">{error}</div>}
          <div style={{display:'flex', gap:'0.5rem', marginTop:'0.5rem'}}>
            <button type="button" className="login-btn" style={{background:'#bdbdbd'}} onClick={onClose} disabled={loading}>취소</button>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? '가입 중...' : '회원가입'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupModal;
