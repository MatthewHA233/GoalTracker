import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  onLabelChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  hint?: string;
}

export function NumberInput({
  value,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
  label,
  onLabelChange,
  className = '',
  disabled = false,
  hint
}: NumberInputProps) {
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [tempLabel, setTempLabel] = useState(label || '');
  const [inputValue, setInputValue] = useState(value.toString());

  const handleChange = (newValue: number) => {
    if (disabled) return;
    const clampedValue = Math.min(max, Math.max(min, newValue));
    onChange(clampedValue);
    setInputValue(clampedValue.toString());
  };

  const increment = (amount: number = step) => {
    if (disabled) return;
    handleChange(value + amount);
  };

  const decrement = (amount: number = step) => {
    if (disabled) return;
    handleChange(value - amount);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const val = e.target.value;
    setInputValue(val);
    
    if (val === '') return;
    
    const numVal = parseInt(val);
    if (!isNaN(numVal)) {
      onChange(numVal);
    }
  };

  const handleInputBlur = () => {
    if (disabled) return;
    if (inputValue === '') {
      handleChange(min);
    } else {
      const numVal = parseInt(inputValue);
      if (!isNaN(numVal)) {
        handleChange(numVal);
      } else {
        setInputValue(value.toString());
      }
    }
  };

  const handleLabelClick = () => {
    if (disabled || !onLabelChange) return;
    setIsEditingLabel(true);
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempLabel(e.target.value);
  };

  const handleLabelBlur = () => {
    setIsEditingLabel(false);
    if (onLabelChange && tempLabel.trim()) {
      onLabelChange(tempLabel.trim());
    }
  };

  const handleLabelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLabelBlur();
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className} ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex flex-col gap-0.5">
        <button
          type="button"
          onClick={() => increment()}
          disabled={disabled}
          className={`p-1 ${
            disabled 
              ? 'text-purple-300/30'
              : 'hover:bg-purple-500/10 text-purple-300/60 hover:text-purple-300'
          } transition-colors rounded-md`}
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => decrement()}
          disabled={disabled}
          className={`p-1 ${
            disabled 
              ? 'text-purple-300/30'
              : 'hover:bg-purple-500/10 text-purple-300/60 hover:text-purple-300'
          } transition-colors rounded-md`}
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
      <div className="relative flex-1">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          disabled={disabled}
          className={`w-full px-3 py-2 bg-[#1a1a1a] border border-purple-900/30 rounded-lg text-purple-100 ${
            disabled 
              ? 'cursor-not-allowed'
              : 'focus:outline-none focus:ring-2 focus:ring-purple-500/50'
          } transition-all appearance-none`}
        />
        {label && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {isEditingLabel ? (
              <input
                type="text"
                value={tempLabel}
                onChange={handleLabelChange}
                onBlur={handleLabelBlur}
                onKeyDown={handleLabelKeyDown}
                className="w-12 px-1 py-0.5 bg-[#1a1a1a] border border-purple-500/30 rounded text-purple-100 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                autoFocus
              />
            ) : (
              <>
                <span
                  onClick={handleLabelClick}
                  className={`text-purple-300/60 text-sm ${
                    onLabelChange && !disabled ? 'cursor-pointer hover:text-purple-300' : ''
                  }`}
                >
                  {label}
                </span>
                {hint && (
                  <span className="text-xs text-purple-300/40">({hint})</span>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}