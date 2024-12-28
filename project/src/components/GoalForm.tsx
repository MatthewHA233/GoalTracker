import React from 'react';
import { TimeInput } from './TimeInput';
import { NumberInput } from './NumberInput';

interface GoalFormProps {
  totalTasks: number;
  measureWord: string;
  totalTime: number;
  onTotalTasksChange: (value: number) => void;
  onMeasureWordChange: (value: string) => void;
  onTotalTimeChange: (value: number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function GoalForm({
  totalTasks,
  measureWord,
  totalTime,
  onTotalTasksChange,
  onMeasureWordChange,
  onTotalTimeChange,
  onSubmit
}: GoalFormProps) {
  const hours = Math.floor(totalTime / 60);
  const minutes = totalTime % 60;

  return (
    <div className="bg-[#151515] rounded-xl shadow-2xl p-8 mb-8 border border-purple-900/20">
      <h2 className="text-2xl font-semibold mb-6 text-purple-400">设置目标</h2>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">
              总任务数
            </label>
            <NumberInput
              value={totalTasks}
              onChange={onTotalTasksChange}
              min={1}
              step={1}
              label={measureWord}
              onLabelChange={onMeasureWordChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">
              总时间
            </label>
            <TimeInput
              hours={hours}
              minutes={minutes}
              onChange={onTotalTimeChange}
            />
          </div>
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-500 transition-all duration-300 shadow-lg hover:shadow-purple-500/20"
          >
            开始追踪
          </button>
        </div>
      </form>
    </div>
  );
}