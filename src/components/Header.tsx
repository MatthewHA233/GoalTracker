import React, { useState } from 'react';
import { UserButton } from './UserButton';
import { useAuthStore } from '../stores/authStore';
import { Settings } from 'lucide-react';
import { UserSettings } from './UserSettings';

interface HeaderProps {
  isTimerRunning: boolean;
  onTimerPause: () => void;
  showTitle?: boolean;
}

export function Header({ isTimerRunning, onTimerPause, showTitle = true }: HeaderProps) {
  const [showSettings, setShowSettings] = useState(false);

  const handleSettingsClick = () => {
    if (isTimerRunning) {
      onTimerPause();
    }
    setShowSettings(true);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2 mb-8">
        {showTitle && (
          <div className="w-full sm:w-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-purple-500">
              小目标追踪器
              <div className="text-xs sm:text-sm text-purple-300/60 mt-1 sm:mt-2">追踪你的工作、学习进度</div>
            </h1>
          </div>
        )}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <UserButton
            isTimerRunning={isTimerRunning}
            onTimerPause={onTimerPause}
          />
          <button
            onClick={handleSettingsClick}
            className="group relative px-3 sm:px-4 py-2 rounded-lg text-purple-300/60 hover:text-purple-300 transition-colors text-sm sm:text-base"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            <div className="absolute -top-8 right-0 bg-[#1a1a1a] px-2 py-1 rounded text-xs text-purple-300/60 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              账号设置
            </div>
          </button>
          <button
            onClick={() => useAuthStore.getState().signOut()}
            className="px-3 sm:px-4 py-2 rounded-lg text-purple-300/60 hover:text-purple-300 transition-colors text-sm sm:text-base"
          >
            退出登录
          </button>
        </div>
      </div>

      {showSettings && (
        <UserSettings onClose={() => setShowSettings(false)} />
      )}
    </>
  );
}