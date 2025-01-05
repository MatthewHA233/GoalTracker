import React, { useState } from 'react';
import { Settings } from 'lucide-react';

interface TaskSuggestionSettings {
  taskName: string;
  speedAdjustment: number;
  sampleSize: number | null;
  onUpdate: (settings: { speedAdjustment: number; sampleSize: number | null }) => void;
}

export function TaskSuggestionSettings({ 
  taskName, 
  speedAdjustment = 0,
  sampleSize,
  onUpdate 
}: TaskSuggestionSettings) {
  const [isOpen, setIsOpen] = useState(false);
  const [adjustment, setAdjustment] = useState(speedAdjustment);
  const [size, setSize] = useState<number | null>(sampleSize);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ speedAdjustment: adjustment, sampleSize: size });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className="text-purple-300/60 hover:text-purple-300 transition-colors"
      >
        <Settings className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#151515] rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-purple-400 mb-4">
              {taskName} 的建议设置
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  速度调整
                </label>
                <select
                  value={adjustment}
                  onChange={(e) => setAdjustment(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-purple-900/30 rounded-lg text-purple-100"
                >
                  <option value={-20}>比平均慢 20%</option>
                  <option value={-10}>比平均慢 10%</option>
                  <option value={-5}>比平均慢 5%</option>
                  <option value={0}>使用平均值</option>
                  <option value={5}>比平均快 5%</option>
                  <option value={10}>比平均快 10%</option>
                  <option value={20}>比平均快 20%</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  采样范围
                </label>
                <select
                  value={size === null ? 'all' : size}
                  onChange={(e) => setSize(e.target.value === 'all' ? null : Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-purple-900/30 rounded-lg text-purple-100"
                >
                  <option value="all">全部记录</option>
                  <option value={3}>最近 3 次</option>
                  <option value={5}>最近 5 次</option>
                  <option value={10}>最近 10 次</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-lg text-purple-300/60 hover:text-purple-300"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 rounded-lg text-white hover:bg-purple-500"
                >
                  确定
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}