import React from 'react';
import { Clock } from 'lucide-react';
import { NumberInput } from './NumberInput';

interface TimeInputProps {
  hours: number;
  minutes: number;
  seconds: number;
  onChange: (totalMinutes: number) => void;
  disabled?: boolean;
}

export function TimeInput({ hours, minutes, seconds, onChange, disabled = false }: TimeInputProps) {
  const handleHoursChange = (newHours: number) => {
    onChange((newHours * 60) + minutes + (seconds / 60));
  };

  const handleMinutesChange = (newMinutes: number) => {
    onChange((hours * 60) + newMinutes + (seconds / 60));
  };

  const handleSecondsChange = (newSeconds: number) => {
    onChange((hours * 60) + minutes + (newSeconds / 60));
  };

  return (
    <div className={`flex items-center gap-2 ${disabled ? 'opacity-50' : ''}`}>
      <Clock className="w-5 h-5 text-purple-400" />
      <div className="flex-1 flex gap-2">
        <div className="flex-1">
          <NumberInput
            value={hours}
            onChange={handleHoursChange}
            min={0}
            max={99}
            label="时"
            disabled={disabled}
          />
        </div>
        <div className="flex-1">
          <NumberInput
            value={minutes}
            onChange={handleMinutesChange}
            min={0}
            max={59}
            label="分"
            disabled={disabled}
          />
        </div>
        <div className="flex-1">
          <NumberInput
            value={seconds}
            onChange={handleSecondsChange}
            min={0}
            max={59}
            label="秒"
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}