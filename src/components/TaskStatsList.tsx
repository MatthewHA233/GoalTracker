import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Trash2, ClipboardList, ChevronDown, ChevronUp } from 'lucide-react';
import { formatTime } from '../utils/timeUtils';
import { TaskSnapshots } from './TaskSnapshots';
import { supabase } from '../lib/supabase';
import type { TaskStats } from '../types/task';

interface TaskStatsListProps {
  stats: TaskStats[];
  onDeleteRecord: (recordId: string) => void;
}

export function TaskStatsList({ stats, onDeleteRecord }: TaskStatsListProps) {
  const [expandedRecords, setExpandedRecords] = useState<string[]>([]);
  const [snapshotsMap, setSnapshotsMap] = useState<Record<string, any[]>>({});
  const [loadingRecords, setLoadingRecords] = useState<string[]>([]);

  const toggleRecord = async (recordId: string) => {
    if (expandedRecords.includes(recordId)) {
      setExpandedRecords(expandedRecords.filter(id => id !== recordId));
      return;
    }

    setExpandedRecords([...expandedRecords, recordId]);

    if (!snapshotsMap[recordId]) {
      setLoadingRecords([...loadingRecords, recordId]);
      try {
        const { data, error } = await supabase
          .from('task_snapshots')
          .select('*')
          .eq('task_record_id', recordId)
          .order('task_number', { ascending: true });

        if (error) throw error;
        setSnapshotsMap({ ...snapshotsMap, [recordId]: data || [] });
      } catch (error) {
        console.error('Error fetching snapshots:', error);
      } finally {
        setLoadingRecords(loadingRecords.filter(id => id !== recordId));
      }
    }
  };

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
        <div key={stat.name} className="bg-[#151515] rounded-xl p-6">
          <h3 className="text-xl font-semibold text-purple-400 mb-4">{stat.name}</h3>
          <div className="text-sm text-purple-300/60 mb-6">
            <div>总平均用时：{formatTime(stat.totalAverage)}/{stat.measureWord}</div>
            <div>总完成：{stat.totalCompleted}/{stat.totalTarget} {stat.measureWord}</div>
          </div>
          
          <div className="space-y-4">
            {stat.records.map((record, index) => (
              <div key={record.id} className="bg-[#1a1a1a] rounded-lg">
                <div 
                  onClick={() => toggleRecord(record.id)}
                  className="w-full p-4 cursor-pointer"
                >
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
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteRecord(record.id);
                        }}
                        className="p-2 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {expandedRecords.includes(record.id) ? (
                        <ChevronUp className="w-4 h-4 text-purple-300/60" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-purple-300/60" />
                      )}
                    </div>
                  </div>
                </div>

                {expandedRecords.includes(record.id) && (
                  <div className="px-4 pb-4">
                    {loadingRecords.includes(record.id) ? (
                      <div className="text-center py-4 text-purple-300/60">
                        加载中...
                      </div>
                    ) : snapshotsMap[record.id]?.length > 0 ? (
                      <TaskSnapshots
                        snapshots={snapshotsMap[record.id]}
                        measureWord={record.measure_word}
                        averageTimePerTask={record.average_time}
                      />
                    ) : (
                      <div className="text-center py-4 text-purple-300/60">
                        暂无记录
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}