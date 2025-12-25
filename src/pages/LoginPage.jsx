import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { List } from 'lucide-react';
import * as api from '../services/api';

export default function LoginPage({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    account: '',
    password: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        // 회원가입
        if (!formData.account || !formData.password || !formData.name) {
          setError('모든 항목을 입력하세요.');
          return;
        }

        await api.signup(formData.account, formData.password, formData.name);

        // 회원가입 성공 후 자동 로그인
        const accessToken = await api.signin(formData.account, formData.password);
        onLogin({
          account: formData.account,
          name: formData.name,
          accessToken
        });
      } else {
        // 로그인
        if (!formData.account || !formData.password) {
          setError('아이디와 비밀번호를 모두 입력하세요.');
          return;
        }

        const accessToken = await api.signin(formData.account, formData.password);
        onLogin({
          account: formData.account,
          name: formData.account,
          accessToken
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-2">
            <List className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {isSignup ? '회원가입' : '로그인'}
          </CardTitle>
          <CardDescription>
            {isSignup
              ? 'MyTodoList에 가입하세요'
              : 'MyTodoList에 오신 것을 환영합니다'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="account" className="text-sm font-medium">
                아이디
              </label>
              <Input
                id="account"
                name="account"
                type="text"
                placeholder="아이디를 입력하세요"
                value={formData.account}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                비밀번호
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {isSignup && (
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  이름
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="이름을 입력하세요"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '처리 중...' : (isSignup ? '회원가입' : '로그인')}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            {isSignup ? (
              <p>
                이미 계정이 있으신가요?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignup(false);
                    setError('');
                  }}
                  className="text-primary font-medium hover:underline"
                  disabled={loading}
                >
                  로그인
                </button>
              </p>
            ) : (
              <p>
                계정이 없으신가요?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignup(true);
                    setError('');
                  }}
                  className="text-primary font-medium hover:underline"
                  disabled={loading}
                >
                  회원가입
                </button>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
