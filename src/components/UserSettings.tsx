import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { X } from 'lucide-react';

interface UserSettingsProps {
  onClose: () => void;
}

export function UserSettings({ onClose }: UserSettingsProps) {
  const { user, updateProfile, updatePassword } = useAuthStore();
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({ username });
      alert('用户名更新成功');
    } catch (error) {
      alert('更新失败');
    }
    setLoading(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updatePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      alert('密码更新成功');
    } catch (error) {
      alert('密码更新失败');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#151515] rounded-xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-purple-400">账号设置</h2>
          <button
            onClick={onClose}
            className="p-2 text-purple-300/60 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleUpdateProfile} className="mb-8">
          <h3 className="text-lg font-medium text-purple-300 mb-4">修改用户名</h3>
          <div className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="新用户名"
              className="w-full px-3 py-2 bg-[#1a1a1a] border border-purple-900/30 rounded-lg text-purple-100"
            />
            <button
              type="submit"
              disabled={loading || !username}
              className="px-4 py-2 bg-purple-600 rounded-lg text-white hover:bg-purple-500 disabled:opacity-50"
            >
              更新用户名
            </button>
          </div>
        </form>

        <form onSubmit={handleUpdatePassword}>
          <h3 className="text-lg font-medium text-purple-300 mb-4">修改密码</h3>
          <div className="space-y-4">
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="当前密码"
              className="w-full px-3 py-2 bg-[#1a1a1a] border border-purple-900/30 rounded-lg text-purple-100"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="新密码"
              className="w-full px-3 py-2 bg-[#1a1a1a] border border-purple-900/30 rounded-lg text-purple-100"
            />
            <button
              type="submit"
              disabled={loading || !currentPassword || !newPassword}
              className="px-4 py-2 bg-purple-600 rounded-lg text-white hover:bg-purple-500 disabled:opacity-50"
            >
              更新密码
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}