import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface TaskTimeAdjusterProps {
  currentAverage: number;
  suggestedAverage: number;
  onAdjust: (newAverage: number) => void;
}

export function TaskTimeAdjuster({
  currentAverage,
  suggestedAverage,
  onAdjust
}: TaskTimeAdjusterProps) {
  const averageTime = (currentAverage + suggestedAverage) / 2;

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-4 mb-6">
      <h3 className="text-lg font-medium text-purple-300 mb-4">调整目标时间</h3>
      
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm text-purple-300/60">
          <div>当前平均: {Math.round(currentAverage)}秒</div>
          <div>建议平均: {Math.round(suggestedAverage)}秒</div>
          <div>调整后: {Math.round(averageTime)}秒</div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onAdjust(averageTime * 0.95)}
            className="p-2 text-purple-300/60 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition-colors"
          >
            <ChevronDown className="w-5 h-5" />
            -5%
          </button>
          <button
            onClick={() => onAdjust(averageTime)}
            className="px-4 py-2 bg-purple-600 rounded-lg text-white hover:bg-purple-500"
          >
            应用
          </button>
          <button
            onClick={() => onAdjust(averageTime * 1.05)}
            className="p-2 text-purple-300/60 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition-colors"
          >
            <ChevronUp className="w-5 h-5" />
            +5%
          </button>
        </div>
      </div>
    </div>
  );
}