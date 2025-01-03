import React from 'react';
import { UserButton } from './UserButton';
import { useAuthStore } from '../stores/authStore';

interface HeaderProps {
  isTimerRunning: boolean;
  onTimerPause: () => void;
}

export function Header({ isTimerRunning, onTimerPause }: HeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-purple-500">
        小目标追踪器
        <div className="text-sm text-purple-300/60 mt-2">追踪你的工作、学习进度</div>
      </h1>
      <div className="flex items-center gap-2">
        <UserButton
          isTimerRunning={isTimerRunning}
          onTimerPause={onTimerPause}
        />
        <button
          onClick={() => useAuthStore.getState().signOut()}
          className="px-4 py-2 rounded-lg text-purple-300/60 hover:text-purple-300 transition-colors"
        >
          退出登录
        </button>
      </div>
    </div>
  );
}