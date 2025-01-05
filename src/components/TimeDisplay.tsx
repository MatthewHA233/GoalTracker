import React from 'react';

interface TimeDisplayProps {
  seconds: number;
  milliseconds: number;
  showHours?: boolean;
}

export function TimeDisplay({ seconds, milliseconds, showHours = false }: TimeDisplayProps) {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  return (
    <>
      {(showHours || hours > 0) && (
        <>
          {String(hours).padStart(2, '0')}
          <span className="opacity-50">:</span>
        </>
      )}
      {String(mins).padStart(2, '0')}
      <span className="opacity-50">:</span>
      {String(secs).padStart(2, '0')}
      <span className="ms-display">.{String(milliseconds).padStart(2, '0')}</span>
    </>
  );
}