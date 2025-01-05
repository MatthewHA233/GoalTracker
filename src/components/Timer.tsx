import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { TimeDisplay } from './TimeDisplay';
import { formatTimeWithPrecision } from '../utils/timeUtils';

interface TimerProps {
  totalElapsedTime: number;
  taskElapsedTime: number;
  averageTimePerTask: number;
  taskCount: number;
  totalTimeLimit: number; // 新增总时间限制
  isRunning: boolean;
  isOverTime: boolean;
  isTaskOverTime: boolean;
  shouldResetTimer: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onTimerReset: () => void;
}

export function Timer({
  totalElapsedTime,
  taskElapsedTime,
  averageTimePerTask,
  taskCount,
  totalTimeLimit, // 新增参数
  isRunning,
  isOverTime,
  isTaskOverTime,
  shouldResetTimer,
  onStart,
  onPause,
  onReset,
  onTimerReset
}: TimerProps) {
  const [taskMilliseconds, setTaskMilliseconds] = React.useState(0);
  const [totalMilliseconds, setTotalMilliseconds] = React.useState(0);
  const startTimeRef = React.useRef<number | null>(null);
  const animationFrameRef = React.useRef<number>();
  const offsetRef = React.useRef(0);

  // 检查是否需要显示小时
  const showHours = totalElapsedTime >= 3600 || taskElapsedTime >= 3600 || averageTimePerTask >= 3600;

  React.useEffect(() => {
    const updateTimer = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
        offsetRef.current = 0;
      }

      const elapsed = timestamp - startTimeRef.current;
      const adjustedElapsed = elapsed + offsetRef.current;
      
      const msOffset = 15;
      
      const totalMs = (adjustedElapsed % 1000) + msOffset;
      setTotalMilliseconds(Math.floor(totalMs / 10) % 100);
      
      const taskMs = ((adjustedElapsed + taskElapsedTime * 1000) % 1000) + msOffset;
      setTaskMilliseconds(Math.floor(taskMs / 10) % 100);

      if (elapsed >= 1000) {
        startTimeRef.current = timestamp;
        offsetRef.current = adjustedElapsed % 1000;
      }

      animationFrameRef.current = requestAnimationFrame(updateTimer);
    };

    if (isRunning) {
      startTimeRef.current = null;
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      startTimeRef.current = null;
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, taskElapsedTime]);

  React.useEffect(() => {
    if (shouldResetTimer) {
      setTaskMilliseconds(0);
      onTimerReset();
    }
  }, [shouldResetTimer, onTimerReset]);

  // 计算当前目标时间进度，不超过总时间限制
  const currentTargetTime = Math.min(averageTimePerTask * (taskCount + 1), totalTimeLimit);

  return (
    <>
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        <button
          onClick={onStart}
          disabled={isRunning}
          className={`flex items-center px-4 py-2 rounded-lg text-sm sm:text-base ${
            isRunning 
              ? 'bg-purple-900/30 text-purple-300/50' 
              : 'bg-purple-600 hover:bg-purple-500 text-white'
          } transition-all duration-300 shadow-lg hover:shadow-purple-500/20`}
        >
          <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" />
          开始
        </button>
        <button
          onClick={onPause}
          disabled={!isRunning}
          className={`flex items-center px-4 py-2 rounded-lg text-sm sm:text-base ${
            !isRunning
              ? 'bg-purple-900/30 text-purple-300/50'
              : 'bg-purple-600 hover:bg-purple-500 text-white'
          } transition-all duration-300 shadow-lg hover:shadow-purple-500/20`}
        >
          <Pause className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" />
          暂停
        </button>
        <button
          onClick={() => {
            onReset();
            setTaskMilliseconds(0);
            setTotalMilliseconds(0);
            startTimeRef.current = null;
            offsetRef.current = 0;
          }}
          className="flex items-center px-4 py-2 rounded-lg text-sm sm:text-base bg-red-600 hover:bg-red-500 text-white transition-all duration-300 shadow-lg hover:shadow-red-500/20"
        >
          <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" />
          重置
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-6 mb-8">
        <div className="text-center">
          <h3 className="text-sm sm:text-lg font-medium mb-2 sm:mb-4 text-purple-300">当前任务</h3>
          <div className="digital-display transform-none sm:transform">
            <div className={`time-value ${isTaskOverTime ? 'text-red-400' : 'text-purple-400'}`}>
              <TimeDisplay 
                seconds={taskElapsedTime} 
                milliseconds={taskMilliseconds}
                showHours={showHours}
              />
            </div>
          </div>
          <div className="text-xs sm:text-sm text-purple-300/60 mt-2 sm:mt-4">
            平均目标时间: {formatTimeWithPrecision(averageTimePerTask)}
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-sm sm:text-lg font-medium mb-2 sm:mb-4 text-purple-300">总时间</h3>
          <div className="digital-display transform-none sm:transform">
            <div className={`time-value ${isOverTime ? 'text-red-400' : 'text-purple-400'}`}>
              <TimeDisplay 
                seconds={totalElapsedTime} 
                milliseconds={totalMilliseconds}
                showHours={showHours}
              />
            </div>
          </div>
          <div className="text-xs sm:text-sm text-purple-300/60 mt-2 sm:mt-4">
            当前目标时间进度: {formatTimeWithPrecision(currentTargetTime)}
          </div>
        </div>
      </div>
    </>
  );
}