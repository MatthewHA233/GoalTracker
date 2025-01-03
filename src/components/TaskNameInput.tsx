import React, { useEffect, useState } from 'react';
import { useTaskStore } from '../stores/taskStore';

interface TaskNameInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function TaskNameInput({ value, onChange }: TaskNameInputProps) {
  const { tasks, loading, fetchTasks } = useTaskStore();
  const [isCreatingNew, setIsCreatingNew] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleSelectTask = (taskName: string) => {
    onChange(taskName);
    setIsCreatingNew(false);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-purple-300 mb-2">
        任务名称
      </label>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsCreatingNew(true);
          }}
          placeholder="输入任务名称"
          className="flex-1 px-3 py-2 bg-[#1a1a1a] border border-purple-900/30 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        />
      </div>

      {tasks.length > 0 && (
        <div className="mt-2">
          <div className="text-sm text-purple-300/60 mb-2">历史任务：</div>
          <div className="flex flex-wrap gap-2">
            {tasks.map((task) => (
              <button
                key={task.id}
                type="button"
                onClick={() => handleSelectTask(task.name)}
                className={`px-3 py-1 rounded-full text-sm ${
                  task.name === value && !isCreatingNew
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-500/10 text-purple-300/60 hover:bg-purple-500/20 hover:text-purple-300'
                } transition-all`}
              >
                {task.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}