import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Timer } from './Timer';

interface TrackerPanelProps {
  totalElapsedTime: number;
  taskElapsedTime: number;
  averageTimePerTask: number;
  taskCount: number;
  totalTasks: number;
  isRunning: boolean;
  isOverTime: boolean;
  isTaskOverTime: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onRecordTask: () => void;
}

export function TrackerPanel({
  totalElapsedTime,
  taskElapsedTime,
  averageTimePerTask,
  taskCount,
  totalTasks,
  isRunning,
  isOverTime,
  isTaskOverTime,
  onStart,
  onPause,
  onReset,
  onRecordTask
}: TrackerPanelProps) {
  return (
    <div className="bg-[#151515] rounded-xl shadow-2xl p-6 border border-purple-900/20">
      <Timer
        totalElapsedTime={totalElapsedTime}
        taskElapsedTime={taskElapsedTime}
        averageTimePerTask={averageTimePerTask}
        taskCount={taskCount}
        isRunning={isRunning}
        isOverTime={isOverTime}
        isTaskOverTime={isTaskOverTime}
        onStart={onStart}
        onPause={onPause}
        onReset={onReset}
      />

      <div className="text-center mb-8">
        <button
          onClick={onRecordTask}
          disabled={!isRunning || taskCount >= totalTasks}
          className={`flex items-center px-6 py-3 rounded-lg mx-auto ${
            !isRunning || taskCount >= totalTasks
              ? 'bg-purple-900/30 text-purple-300/50'
              : 'bg-purple-600 hover:bg-purple-500 text-white'
          } transition-all duration-300 shadow-lg hover:shadow-purple-500/20`}
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          记录目标 ({taskCount}/{totalTasks})
        </button>
      </div>
    </div>
  );
}