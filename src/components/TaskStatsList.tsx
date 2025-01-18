import React from 'react';
import { ClipboardList } from 'lucide-react';
import { TaskStats } from './TaskStats';
import type { TaskStats as TaskStatsType } from '../types/task';

interface TaskStatsListProps {
  stats: TaskStatsType[];
  onDeleteTask: (taskName: string) => void;
  onDeleteRecord: (recordId: string) => void;
  onContinueRecord: (record: any, taskName: string) => void;
  onClose?: () => void;
}

export function TaskStatsList({ 
  stats, 
  onDeleteTask, 
  onDeleteRecord, 
  onContinueRecord,
  onClose 
}: TaskStatsListProps) {
  if (stats.length === 0) {
    return (
      <div className="bg-[#151515] rounded-xl p-8 text-center">
        <ClipboardList className="w-12 h-12 text-purple-300/30 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-purple-300 mb-2">暂无历史记录</h3>
        <p className="text-sm text-purple-300/60">请新建任务并点击记录目标</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {stats.map(stat => (
        <TaskStats
          key={stat.name}
          stat={stat}
          onDeleteTask={onDeleteTask}
          onDeleteRecord={onDeleteRecord}
          onContinueRecord={onContinueRecord}
          onClose={onClose}
        />
      ))}
    </div>
  );
}