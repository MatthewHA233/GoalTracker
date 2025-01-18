import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, Edit2, X, Check, Hash } from 'lucide-react';
import { Timer } from './Timer';
import { Confetti } from './Confetti';
import { formatTimeWithUnit } from '../utils/timeUtils';
import { TimeInput } from './TimeInput';
import { NumberInput } from './NumberInput';

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
  onTotalTimeChange?: (minutes: number) => void;
  onTotalTasksChange?: (count: number) => void;
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
  onTotalTimeChange,
  onTotalTasksChange
}: TrackerPanelProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [isEditingTasks, setIsEditingTasks] = useState(false);
  const [tempTime, setTempTime] = useState({
    hours: Math.floor(totalTimeLimit / 3600),
    minutes: Math.floor((totalTimeLimit % 3600) / 60),
    seconds: totalTimeLimit % 60
  });
  const [tempTasks, setTempTasks] = useState(totalTasks);

  // 计算当前平均用时（基于已完成的任务）
  const currentAverageTime = taskCount > 0
    ? Math.round(totalElapsedTime / taskCount)
    : averageTimePerTask;

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

  const handleTimeChange = (totalMinutes: number) => {
    const totalSeconds = totalMinutes * 60;
    setTempTime({
      hours: Math.floor(totalSeconds / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60
    });
  };

  const handleTimeSubmit = () => {
    if (onTotalTimeChange) {
      const totalMinutes = tempTime.hours * 60 + tempTime.minutes + tempTime.seconds / 60;
      onTotalTimeChange(totalMinutes);
    }
    setIsEditingTime(false);
  };

  const handleTasksSubmit = () => {
    if (onTotalTasksChange && tempTasks >= taskCount + 1) {
      onTotalTasksChange(tempTasks);
    }
    setIsEditingTasks(false);
  };

  const handleEditTimeClick = () => {
    if (isRunning) {
      onPause();
    }
    setTempTime({
      hours: Math.floor(totalTimeLimit / 3600),
      minutes: Math.floor((totalTimeLimit % 3600) / 60),
      seconds: totalTimeLimit % 60
    });
    setIsEditingTime(true);
  };

  const handleEditTasksClick = () => {
    if (isRunning) {
      onPause();
    }
    setTempTasks(totalTasks);
    setIsEditingTasks(true);
  };

  const handleApplyCurrentAverage = () => {
    if (onTotalTimeChange && taskCount > 0) {
      const suggestedTotalMinutes = (currentAverageTime * totalTasks) / 60;
      onTotalTimeChange(suggestedTotalMinutes);
    }
    setIsEditingTime(false);
  };

  return (
    <div className="bg-[#151515] rounded-xl shadow-2xl p-6 border border-purple-900/20">
      <Confetti active={showConfetti} />

      <div className="mb-6 text-center space-y-3">
        <h2 className="text-xl font-semibold text-purple-400 mb-2">
          {taskName}
        </h2>
        
        <div className="flex items-center justify-center gap-2">
          {isEditingTime ? (
            <div className="flex flex-col items-center gap-3">
              <TimeInput
                hours={tempTime.hours}
                minutes={tempTime.minutes}
                seconds={tempTime.seconds}
                onChange={handleTimeChange}
              />
              <div className="flex items-center gap-2">
                {taskCount > 0 && (
                  <button
                    onClick={handleApplyCurrentAverage}
                    className="text-sm text-purple-300/60 hover:text-purple-300 transition-colors"
                  >
                    使用当前平均用时 ({formatTimeWithUnit(currentAverageTime)})
                  </button>
                )}
                <button
                  onClick={() => setIsEditingTime(false)}
                  className="p-1.5 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  onClick={handleTimeSubmit}
                  className="p-1.5 text-green-400/60 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-sm text-purple-300/60">
              <Clock className="w-4 h-4" />
              <span>目标总时长: {formatTimeWithUnit(totalTimeLimit)}</span>
              <button
                onClick={handleEditTimeClick}
                className="p-1.5 text-purple-300/60 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition-colors"
                title="修改总时长"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-2">
          {isEditingTasks ? (
            <div className="flex items-center gap-2">
              <NumberInput
                value={tempTasks}
                onChange={setTempTasks}
                min={taskCount + 1}
                step={1}
              />
              <button
                onClick={() => setIsEditingTasks(false)}
                className="p-1.5 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                onClick={handleTasksSubmit}
                className="p-1.5 text-green-400/60 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-sm text-purple-300/60">
              <Hash className="w-4 h-4" />
              <span>目标总数: {totalTasks}</span>
              <button
                onClick={handleEditTasksClick}
                className="p-1.5 text-purple-300/60 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition-colors"
                title="修改目标数"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
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