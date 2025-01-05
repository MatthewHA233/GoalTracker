import React from 'react';
import { Trash2 } from 'lucide-react';
import { TaskRecordsList } from './TaskRecordsList';
import { formatTime } from '../utils/timeUtils';
import type { TaskStats } from '../types/task';

interface TaskStatsProps {
  stat: TaskStats;
  onDeleteTask: (taskName: string) => void;
  onDeleteRecord: (recordId: string) => void;
}

export function TaskStats({ stat, onDeleteTask, onDeleteRecord }: TaskStatsProps) {
  const handleDeleteTask = () => {
    if (confirm(`确定要删除"${stat.name}"及其所有记录吗？`)) {
      onDeleteTask(stat.name);
    }
  };

  return (
    <div className="bg-[#151515] rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-purple-400">{stat.name}</h3>
        <button
          onClick={handleDeleteTask}
          className="p-2 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      <div className="text-sm text-purple-300/60 mb-6 flex items-center gap-4">
        <div>总平均用时：{formatTime(stat.totalAverage)}/{stat.measureWord}</div>
        <div>总完成：{stat.totalCompleted}/{stat.totalTarget} {stat.measureWord}</div>
      </div>
      
      <TaskRecordsList 
        records={stat.records}
        measureWord={stat.measureWord}
        onDeleteRecord={onDeleteRecord}
      />
    </div>
  );
}