import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTaskStore } from '../stores/taskStore';
import { TaskStatsList } from './TaskStatsList';

interface UserProfileProps {
  onClose: () => void;
  isTimerRunning: boolean;
}

export function UserProfile({ onClose, isTimerRunning }: UserProfileProps) {
  const { taskStats, fetchTaskStats, deleteTaskRecord } = useTaskStore();

  React.useEffect(() => {
    fetchTaskStats();
  }, [fetchTaskStats]);

  const handleDeleteRecord = async (recordId: string) => {
    if (!confirm('确定要删除这条记录吗？')) return;
    try {
      await deleteTaskRecord(recordId);
      alert('删除成功');
    } catch (error) {
      alert('删除失败');
    }
  };

  if (isTimerRunning) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-[#151515] rounded-xl p-6 max-w-md w-full">
          <h3 className="text-xl font-semibold text-purple-400 mb-4">注意</h3>
          <p className="text-purple-300 mb-6">计时器正在运行，是否要暂停并查看历史记录？</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-purple-300/60 hover:text-purple-300"
            >
              取消
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-purple-600 rounded-lg text-white hover:bg-purple-500"
            >
              暂停并查看
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] overflow-auto z-50">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onClose}
            className="flex items-center text-purple-300/60 hover:text-purple-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            返回
          </button>
        </div>

        <TaskStatsList stats={taskStats} onDeleteRecord={handleDeleteRecord} />
      </div>
    </div>
  );
}