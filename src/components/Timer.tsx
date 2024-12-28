import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { TimeDisplay } from './TimeDisplay';
import { formatTimeWithPrecision } from '../utils/timeUtils';

interface TimerProps {
  totalElapsedTime: number;
  taskElapsedTime: number;
  averageTimePerTask: number;
  taskCount: number;
  isRunning: boolean;
  isOverTime: boolean;
  isTaskOverTime: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export function Timer({
  totalElapsedTime,
  taskElapsedTime,
  averageTimePerTask,
  taskCount,
  isRunning,
  isOverTime,
  isTaskOverTime,
  onStart,
  onPause,
  onReset
}: TimerProps) {
  const [milliseconds, setMilliseconds] = React.useState(0);
  const lastUpdateRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    let animationFrameId: number;
    
    const updateTimer = (timestamp: number) => {
      if (!lastUpdateRef.current) {
        lastUpdateRef.current = timestamp;
      }
      
      const elapsed = timestamp - lastUpdateRef.current;
      if (elapsed >= 10) { // 每10ms更新一次
        setMilliseconds(prev => {
          const next = (prev + 1) % 100;
          if (next === 0) {
            onStart(); // 更新父组件的秒数
          }
          return next;
        });
        lastUpdateRef.current = timestamp;
      }
      
      if (isRunning) {
        animationFrameId = requestAnimationFrame(updateTimer);
      }
    };

    if (isRunning) {
      animationFrameId = requestAnimationFrame(updateTimer);
    } else {
      lastUpdateRef.current = null;
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isRunning, onStart]);

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
            setMilliseconds(0);
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
              <TimeDisplay seconds={taskElapsedTime} milliseconds={milliseconds} />
            </div>
          </div>
          <div className="text-xs sm:text-sm text-purple-300/60 mt-2 sm:mt-4">
            平均: {formatTimeWithPrecision(averageTimePerTask)}
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-sm sm:text-lg font-medium mb-2 sm:mb-4 text-purple-300">总时间</h3>
          <div className="digital-display transform-none sm:transform">
            <div className={`time-value ${isOverTime ? 'text-red-400' : 'text-purple-400'}`}>
              <TimeDisplay seconds={totalElapsedTime} milliseconds={milliseconds} />
            </div>
          </div>
          <div className="text-xs sm:text-sm text-purple-300/60 mt-2 sm:mt-4">
            目标: {formatTimeWithPrecision(averageTimePerTask * (taskCount + 1))}
          </div>
        </div>
      </div>
    </>
  );
}