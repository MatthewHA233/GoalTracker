import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { UserProfile } from './UserProfile';
import { ClipboardList } from 'lucide-react';

interface UserButtonProps {
  isTimerRunning: boolean;
  onTimerPause?: () => void;
  onContinueRecord: (record: any, taskName: string) => void;
}

export function UserButton({ isTimerRunning, onTimerPause, onContinueRecord }: UserButtonProps) {
  const { user } = useAuthStore();
  const [showProfile, setShowProfile] = useState(false);

  if (!user) return null;

  const handleProfileClick = () => {
    if (isTimerRunning && onTimerPause) {
      onTimerPause();
    }
    setShowProfile(true);
  };

  return (
    <>
      <button
        onClick={handleProfileClick}
        className="group relative px-4 py-2 rounded-lg text-purple-300/60 hover:text-purple-300 transition-colors"
      >
        <div className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4" />
          <span>{user.user_metadata.username || user.email}</span>
        </div>
        <div className="absolute -top-8 right-0 bg-[#1a1a1a] px-2 py-1 rounded text-xs text-purple-300/60 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          历史任务记录
        </div>
      </button>

      {showProfile && (
        <UserProfile
          onClose={() => setShowProfile(false)}
          isTimerRunning={isTimerRunning}
          onContinueRecord={onContinueRecord}
        />
      )}
    </>
  );
}