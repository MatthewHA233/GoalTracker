import React from 'react';
import { formatTime } from '../utils/timeUtils';

interface TimeDisplayProps {
  seconds: number;
  milliseconds: number;
}

export function TimeDisplay({ seconds, milliseconds }: TimeDisplayProps) {
  const timeString = formatTime(seconds);
  return (
    <>
      {timeString}
      <span className="ms-display">.{String(milliseconds).padStart(2, '0')}</span>
    </>
  );
}