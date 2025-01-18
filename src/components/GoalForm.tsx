import React, { useState, useEffect } from 'react';
import { TimeInput } from './TimeInput';
import { NumberInput } from './NumberInput';
import { TaskNameInput } from './TaskNameInput';
import { useTaskStore } from '../stores/taskStore';
import { formatTimeWithUnit } from '../utils/timeUtils';
import { Play } from 'lucide-react';

interface GoalFormProps {
  totalTasks: number;
  measureWord: string;
  totalTime: number;
  onTotalTasksChange: (value: number) => void;
  onMeasureWordChange: (value: string) => void;
  onTotalTimeChange: (value: number) => void;
  onSubmit: (e: React.FormEvent, taskName: string) => void;
  onContinueRecord: (record: any, taskName: string) => void;
}

export function GoalForm({
  totalTasks,
  measureWord,
  totalTime,
  onTotalTasksChange,
  onMeasureWordChange,
  onTotalTimeChange,
  onSubmit,
  onContinueRecord
}: GoalFormProps) {
  const [taskName, setTaskName] = useState('');
  const [timeKey, setTimeKey] = useState(0);
  const { getTaskSuggestion, taskStats } = useTaskStore();
  
  // 获取任务的建议时长和量词
  const suggestion = getTaskSuggestion(taskName);

  // 获取最近一个未完成的任务记录
  const lastUnfinishedRecord = taskStats.reduce<{ record: any; taskName: string } | null>((result, stat) => {
    if (result) return result;
    const unfinishedRecord = stat.records.find(record => record.completed_count < record.total_tasks);
    if (unfinishedRecord) {
      return { record: unfinishedRecord, taskName: stat.name };
    }
    return null;
  }, null);

  // 当选择任务时自动设置量词
  useEffect(() => {
    if (suggestion?.measureWord) {
      onMeasureWordChange(suggestion.measureWord);
    }
  }, [suggestion?.measureWord, onMeasureWordChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) {
      alert('请输入任务名称');
      return;
    }
    if (totalTasks <= 0 || totalTime <= 0) {
      alert('请输入有效的任务数和时间');
      return;
    }
    onSubmit(e, taskName.trim());
  };

  // 计算建议总时长（秒）
  const suggestedTotalSeconds = suggestion ? suggestion.averageTime * totalTasks : 0;

  // 转换总分钟数为时分秒
  const totalSeconds = totalTime * 60;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const handleSuggestedTimeClick = () => {
    // 保持精确的秒数，不进行四舍五入
    const exactMinutes = suggestedTotalSeconds / 60;
    onTotalTimeChange(exactMinutes);
    setTimeKey(prev => prev + 1); // 强制重新渲染TimeInput
  };

  return (
    <div className="bg-[#151515] rounded-xl shadow-2xl p-8 mb-8 border border-purple-900/20">
      {lastUnfinishedRecord && (
        <div className="mb-6 flex items-center justify-between bg-[#1a1a1a] rounded-lg p-4 border border-purple-900/20">
          <div className="text-sm text-purple-300/60">
            上次「{lastUnfinishedRecord.taskName}」未完成
            （{lastUnfinishedRecord.record.completed_count}/{lastUnfinishedRecord.record.total_tasks} {lastUnfinishedRecord.record.measure_word}）
          </div>
          <button
            onClick={() => onContinueRecord(lastUnfinishedRecord.record, lastUnfinishedRecord.taskName)}
            className="flex items-center gap-2 px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white rounded-lg transition-colors text-sm"
          >
            <Play className="w-4 h-4" />
            继续任务
          </button>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-6 text-purple-400">设置目标</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <TaskNameInput
          value={taskName}
          onChange={setTaskName}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">
              总任务数
            </label>
            <NumberInput
              value={totalTasks}
              onChange={(value) => {
                onTotalTasksChange(value);
                if (suggestion) {
                  // 更新建议总时间
                  const newTotalSeconds = suggestion.averageTime * value;
                  const exactMinutes = newTotalSeconds / 60;
                  onTotalTimeChange(exactMinutes);
                  setTimeKey(prev => prev + 1);
                }
              }}
              min={1}
              step={1}
              label={measureWord}
              onLabelChange={onMeasureWordChange}
              hint="点击可更改量词"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2">
              总时间
            </label>
            <div className="space-y-2">
              <TimeInput
                key={timeKey}
                hours={hours}
                minutes={minutes}
                seconds={seconds}
                onChange={(totalMinutes) => {
                  onTotalTimeChange(totalMinutes);
                }}
              />
              {suggestion && (
                <button
                  type="button"
                  onClick={handleSuggestedTimeClick}
                  className="text-sm text-purple-300/60 hover:text-purple-300 transition-colors"
                >
                  建议总时长：{formatTimeWithUnit(suggestedTotalSeconds)}
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-500 transition-all duration-300 shadow-lg hover:shadow-purple-500/20"
          >
            开始追踪
          </button>
        </div>
      </form>
    </div>
  );
}