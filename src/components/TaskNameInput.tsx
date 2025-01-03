import React, { useEffect, useState, useRef } from 'react';
import { useTaskStore } from '../stores/taskStore';
import { Search, X } from 'lucide-react';

interface TaskNameInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function TaskNameInput({ value, onChange }: TaskNameInputProps) {
  const { tasks = [], loading, fetchTasks, deleteTask } = useTaskStore();
  const [isCreatingNew, setIsCreatingNew] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTasks().catch(console.error);
  }, [fetchTasks]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredTasks = tasks.filter(task => 
    task.name.toLowerCase().includes(value.toLowerCase())
  );

  const handleSelectTask = (taskName: string) => {
    onChange(taskName);
    setIsCreatingNew(false);
    setShowDropdown(false);
  };

  const handleDeleteTask = async (taskName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`确定要删除"${taskName}"及其所有记录吗？`)) return;
    try {
      await deleteTask(taskName);
      if (value === taskName) {
        onChange('');
        setIsCreatingNew(true);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('删除失败');
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-purple-300 mb-2">
        任务名称
      </label>
      
      <div className="flex gap-2">
        <div className="relative flex-1" ref={dropdownRef}>
          <input
            type="text"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setIsCreatingNew(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder="输入任务名称"
            className="w-full px-3 py-2 bg-[#1a1a1a] border border-purple-900/30 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
          {tasks.length > 0 && (
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-purple-300/60 hover:text-purple-300 hover:bg-purple-500/10 rounded-md transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {showDropdown && tasks.length > 0 && filteredTasks.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-[#1a1a1a] border border-purple-900/30 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between hover:bg-purple-500/10 group"
                >
                  <button
                    type="button"
                    onClick={() => handleSelectTask(task.name)}
                    className="flex-1 px-4 py-2 text-left text-sm text-purple-300/60 hover:text-purple-300 transition-colors"
                  >
                    {task.name}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteTask(task.name, e)}
                    className="p-2 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity mr-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}