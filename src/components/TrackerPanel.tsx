import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { Timer } from './Timer';
import { Confetti } from './Confetti';
import { formatTimeWithUnit } from '../utils/timeUtils';

interface TrackerPanelProps {
  totalElapsedTime: number;
  taskElapsedTime: number;
  averageTimePerTask: number;
  taskCount: number;
  totalTasks: number;
  totalTimeLimit: number;
  isRunning: boolean;
  isOverTime: boolean;
  isTaskOverTime: boolean;
  shouldResetTimer: boolean;
  taskName: string;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onRecordTask: () => void;
  onTimerReset: () => void;
}

export function TrackerPanel({
  totalElapsedTime,
  taskElapsedTime,
  averageTimePerTask,
  taskCount,
  totalTasks,
  totalTimeLimit,
  isRunning,
  isOverTime,
  isTaskOverTime,
  shouldResetTimer,
  taskName,
  onStart,
  onPause,
  onReset,
  onRecordTask,
  onTimerReset,
}: TrackerPanelProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (taskCount === totalTasks) {
      onPause();
      setShowConfetti(true);
      const timeout = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [taskCount, totalTasks, onPause]);

  return (
    <div className="bg-[#151515] rounded-xl shadow-2xl p-6 border border-purple-900/20">
      <Confetti active={showConfetti} />

      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold text-purple-400 mb-2">
          {taskName}
        </h2>
        <div className="flex items-center justify-center gap-2 text-sm text-purple-300/60">
          <Clock className="w-4 h-4" />
          <span>目标总时长: {formatTimeWithUnit(totalTimeLimit)}</span>
        </div>
      </div>

      <Timer
        totalElapsedTime={totalElapsedTime}
        taskElapsedTime={taskElapsedTime}
        averageTimePerTask={averageTimePerTask}
        taskCount={taskCount}
        totalTimeLimit={totalTimeLimit}
        isRunning={isRunning}
        isOverTime={isOverTime}
        isTaskOverTime={isTaskOverTime}
        shouldResetTimer={shouldResetTimer}
        onTimerReset={onTimerReset}
        onStart={onStart}
        onPause={onPause}
        onReset={onReset}
      />

      <div className="text-center">
        <button
          onClick={onRecordTask}
          disabled={!isRunning || taskCount >= totalTasks}
          className={`flex items-center px-6 py-3 rounded-lg ${
            !isRunning || taskCount >= totalTasks
              ? 'bg-purple-900/30 text-purple-300/50'
              : 'bg-purple-600 hover:bg-purple-500 text-white'
          } transition-all duration-300 shadow-lg hover:shadow-purple-500/20 mx-auto`}
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          记录目标 ({taskCount}/{totalTasks})
        </button>
      </div>
    </div>
  );
}