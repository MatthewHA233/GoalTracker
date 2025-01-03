import React from 'react';
import { formatTime } from '../utils/timeUtils';
import { Timer } from './Timer';

interface TaskSnapshot {
  task_number: number;
  task_time_seconds: number;
  total_time_seconds: number;
}

interface TaskSnapshotsProps {
  snapshots: TaskSnapshot[];
  measureWord: string;
  averageTimePerTask: number;
}

export function TaskSnapshots({ snapshots, measureWord, averageTimePerTask }: TaskSnapshotsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 mt-4">
      {snapshots.map((snapshot, index) => (
        <div 
          key={index}
          className="bg-[#1a1a1a] rounded-lg p-3 border border-purple-900/20 hover:border-purple-500/30 transition-colors"
        >
          <div className="text-base font-medium text-purple-200 mb-2 text-center">
            第{snapshot.task_number}{measureWord}
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-purple-300/60 text-sm">用时</span>
              <span className={`text-base font-mono ${
                snapshot.task_time_seconds > averageTimePerTask ? 'text-red-400' : 'text-green-400'
              }`}>
                {formatTime(snapshot.task_time_seconds)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-purple-300/60 text-sm">累计</span>
              <span className={`text-base font-mono ${
                snapshot.total_time_seconds > averageTimePerTask * snapshot.task_number
                  ? 'text-red-400'
                  : 'text-green-400'
              }`}>
                {formatTime(snapshot.total_time_seconds)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}