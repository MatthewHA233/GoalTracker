import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn, signUp } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setError('两次输入的密码不一致');
          return;
        }
        await signUp(email, password, username);
      } else {
        await signIn(email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '发生错误');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="bg-[#151515] rounded-xl shadow-2xl p-8 border border-purple-900/20">
          <h2 className="text-2xl font-semibold mb-6 text-purple-400">
            {isSignUp ? '注册账号' : '登录账号'}
          </h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-1">
                邮箱
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[#1a1a1a] border border-purple-900/30 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                required
              />
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-1">
                  用户名
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-purple-900/30 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  required
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-1">
                密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[#1a1a1a] border border-purple-900/30 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                required
              />
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-1">
                  确认密码
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-purple-900/30 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  required
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-500 transition-all duration-300"
          >
            {isSignUp ? '注册' : '登录'}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setEmail('');
              setPassword('');
              setConfirmPassword('');
              setUsername('');
            }}
            className="w-full mt-4 px-4 py-2 rounded-lg text-purple-300/60 hover:text-purple-300 transition-colors"
          >
            {isSignUp ? '已有账号？点击登录' : '没有账号？点击注册'}
          </button>
        </form>
      </div>
    </div>
  );
}