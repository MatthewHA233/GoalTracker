import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { UserProfile } from './UserProfile';

interface UserButtonProps {
  isTimerRunning: boolean;
  onTimerPause?: () => void;
}

export function UserButton({ isTimerRunning, onTimerPause }: UserButtonProps) {
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
        className="px-4 py-2 rounded-lg text-purple-300/60 hover:text-purple-300 transition-colors"
      >
        {user.user_metadata.username || user.email}
      </button>

      {showProfile && (
        <UserProfile
          onClose={() => setShowProfile(false)}
          isTimerRunning={isTimerRunning}
        />
      )}
    </>
  );
}