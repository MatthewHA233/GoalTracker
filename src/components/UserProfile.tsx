import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useTaskStore } from '../stores/taskStore';
import { Settings, ArrowLeft } from 'lucide-react';
import { TaskStatsList } from './TaskStatsList';

interface UserProfileProps {
  onClose: () => void;
  isTimerRunning: boolean;
}

export function UserProfile({ onClose, isTimerRunning }: UserProfileProps) {
  const { user, updateProfile, updatePassword } = useAuthStore();
  const { taskStats, fetchTaskStats, deleteTaskRecord } = useTaskStore();
  const [showSettings, setShowSettings] = useState(false);
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTaskStats();
  }, [fetchTaskStats]);

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

  const handleDeleteRecord = async (recordId: string) => {
    if (!confirm('确定要删除这条记录吗？')) return;
    try {
      await deleteTaskRecord(recordId);
      alert('删除成功');
    } catch (error) {
      alert('删除失败');
    }
  };

  if (isTimerRunning) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-[#151515] rounded-xl p-6 max-w-md w-full">
          <h3 className="text-xl font-semibold text-purple-400 mb-4">注意</h3>
          <p className="text-purple-300 mb-6">计时器正在运行，是否要暂停并查看个人页面？</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-purple-300/60 hover:text-purple-300"
            >
              取消
            </button>
            <button
              onClick={() => {
                onClose();
                setShowSettings(false);
              }}
              className="px-4 py-2 bg-purple-600 rounded-lg text-white hover:bg-purple-500"
            >
              暂停并查看
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] overflow-auto z-50">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onClose}
            className="flex items-center text-purple-300/60 hover:text-purple-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            返回
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-purple-300/60 hover:text-purple-300"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {showSettings ? (
          <div className="bg-[#151515] rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-purple-400 mb-6">账号设置</h2>
            
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
        ) : (
          <TaskStatsList stats={taskStats} onDeleteRecord={handleDeleteRecord} />
        )}
      </div>
    </div>
  );
}