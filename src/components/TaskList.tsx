import React from 'react';
import { formatTime } from '../utils/timeUtils';
import { TaskSnapshot } from '../types/task';

interface TaskListProps {
  taskSnapshots: TaskSnapshot[];
  measureWord: string;
  averageTimePerTask: number;
}

export function TaskList({
  taskSnapshots,
  measureWord,
  averageTimePerTask
}: TaskListProps) {
  if (taskSnapshots.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 max-w-[2000px] mx-auto px-4">
      {taskSnapshots.map((snapshot, index) => (
        <div 
          key={index}
          className="bg-[#151515] rounded-lg p-3 border border-purple-900/20 hover:border-purple-500/30 transition-colors"
        >
          <div className="text-base font-medium text-purple-200 mb-2 text-center">
            第{snapshot.taskNumber}{measureWord}
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-purple-300/60 text-sm">用时</span>
              <span className={`text-base font-mono ${
                snapshot.taskTime > averageTimePerTask ? 'text-red-400' : 'text-green-400'
              }`}>
                {formatTime(snapshot.taskTime)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-purple-300/60 text-sm">累计</span>
              <span className={`text-base font-mono ${
                snapshot.totalTime > averageTimePerTask * snapshot.taskNumber
                  ? 'text-red-400'
                  : 'text-green-400'
              }`}>
                {formatTime(snapshot.totalTime)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}