import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { NumberInput } from './NumberInput';

interface TimeInputProps {
  hours: number;
  minutes: number;
  onChange: (totalMinutes: number) => void;
}

export function TimeInput({ hours, minutes, onChange }: TimeInputProps) {
  const handleHoursChange = (newHours: number) => {
    onChange(newHours * 60 + minutes);
  };

  const handleMinutesChange = (newMinutes: number) => {
    onChange(hours * 60 + newMinutes);
  };

  return (
    <div className="flex items-center gap-2">
      <Clock className="w-5 h-5 text-purple-400" />
      <div className="flex-1">
        <NumberInput
          value={hours}
          onChange={handleHoursChange}
          min={0}
          max={24}
          label="时"
        />
      </div>
      <div className="flex-1">
        <NumberInput
          value={minutes}
          onChange={handleMinutesChange}
          min={0}
          max={59}
          label="分"
        />
      </div>
    </div>
  );
}