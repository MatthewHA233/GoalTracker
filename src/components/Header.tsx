import React from 'react';
import { UserButton } from './UserButton';
import { useAuthStore } from '../stores/authStore';

interface HeaderProps {
  isTimerRunning: boolean;
  onTimerPause: () => void;
}

export function Header({ isTimerRunning, onTimerPause }: HeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2 mb-8">
      <div className="w-full sm:w-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-purple-500">
          小目标追踪器
          <div className="text-xs sm:text-sm text-purple-300/60 mt-1 sm:mt-2">追踪你的工作、学习进度</div>
        </h1>
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <UserButton
          isTimerRunning={isTimerRunning}
          onTimerPause={onTimerPause}
        />
        <button
          onClick={() => useAuthStore.getState().signOut()}
          className="px-3 sm:px-4 py-2 rounded-lg text-purple-300/60 hover:text-purple-300 transition-colors text-sm sm:text-base"
        >
          退出登录
        </button>
      </div>
    </div>
  );
}