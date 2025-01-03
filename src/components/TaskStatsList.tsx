import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Trash2 } from 'lucide-react';
import { formatTime } from '../utils/timeUtils';
import type { TaskStats } from '../types/task';

interface TaskStatsListProps {
  stats: TaskStats[];
  onDeleteRecord: (recordId: string) => void;
}

export function TaskStatsList({ stats, onDeleteRecord }: TaskStatsListProps) {
  return (
    <div className="space-y-6">
      {stats.map(stat => (
        <div key={stat.name} className="bg-[#151515] rounded-xl p-6">
          <h3 className="text-xl font-semibold text-purple-400 mb-4">{stat.name}</h3>
          <div className="text-sm text-purple-300/60 mb-6">
            <div>总平均用时：{formatTime(stat.totalAverage)}/{stat.measureWord}</div>
            <div>总完成：{stat.totalCompleted}/{stat.totalTarget} {stat.measureWord}</div>
          </div>
          
          <div className="space-y-4">
            {stat.records.map((record, index) => (
              <div key={record.id} className="bg-[#1a1a1a] p-4 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-medium text-purple-300 mb-2">
                      第{stat.records.length - index}次 创建于
                      {formatDistanceToNow(new Date(record.created_at), { locale: zhCN, addSuffix: true })}
                    </div>
                    <div className="text-sm text-purple-300/60">
                      完成：{record.completed_count}/{record.total_tasks} {record.measure_word}
                    </div>
                    <div className="text-sm text-purple-300/60">
                      平均用时：{formatTime(record.average_time)}/{record.measure_word}
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteRecord(record.id)}
                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}