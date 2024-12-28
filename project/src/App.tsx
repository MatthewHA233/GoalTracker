import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { GoalForm } from './components/GoalForm';
import { Timer } from './components/Timer';
import { TaskList } from './components/TaskList';
import { showTaskCompletionNotification } from './utils/notifications';
import { TaskSnapshot } from './types/task';

function App() {
  const [totalTasks, setTotalTasks] = useState(1);
  const [measureWord, setMeasureWord] = useState('个');
  const [totalTime, setTotalTime] = useState(60);
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);
  const [taskElapsedTime, setTaskElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [taskCount, setTaskCount] = useState(0);
  const [taskSnapshots, setTaskSnapshots] = useState<TaskSnapshot[]>([]);
  const [showTracker, setShowTracker] = useState(false);

  useEffect(() => {
    let interval: number | null = null;
    if (isRunning) {
      interval = window.setInterval(() => {
        setTotalElapsedTime(prev => prev + 1);
        setTaskElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalTasks <= 0 || totalTime <= 0) {
      alert('请输入有效的任务数和时间。');
      return;
    }
    setShowTracker(true);
  };

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  
  const resetTimer = () => {
    setIsRunning(false);
    setTotalElapsedTime(0);
    setTaskElapsedTime(0);
    setTaskCount(0);
    setTaskSnapshots([]);
    setShowTracker(false);
  };

  const recordTask = async () => {
    if (taskCount >= totalTasks) {
      await showTaskCompletionNotification(totalTasks, measureWord, false);
      return;
    }

    const newTaskCount = taskCount + 1;
    setTaskCount(newTaskCount);
    
    const newSnapshot: TaskSnapshot = {
      taskNumber: newTaskCount,
      taskTime: taskElapsedTime,
      totalTime: totalElapsedTime
    };
    setTaskSnapshots(prev => [newSnapshot, ...prev]);
    
    setTaskElapsedTime(0);

    if (newTaskCount >= totalTasks) {
      await showTaskCompletionNotification(totalTasks, measureWord, true);
      setIsRunning(false);
    }
  };

  const averageTimePerTask = totalTime * 60 / totalTasks;
  const isOverTime = totalElapsedTime > averageTimePerTask * (taskCount + 1);
  const isTaskOverTime = taskElapsedTime > averageTimePerTask;

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-[2000px] mx-auto">
        <div className="max-w-3xl mx-auto mb-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-purple-500">
            目标追踪器
            <div className="text-sm text-purple-300/60 mt-2">追踪你的工作、学习进度</div>
          </h1>

          {!showTracker ? (
            <GoalForm
              totalTasks={totalTasks}
              measureWord={measureWord}
              totalTime={totalTime}
              onTotalTasksChange={setTotalTasks}
              onMeasureWordChange={setMeasureWord}
              onTotalTimeChange={setTotalTime}
              onSubmit={handleSubmit}
            />
          ) : (
            <div className="bg-[#151515] rounded-xl shadow-2xl p-6 border border-purple-900/20">
              <Timer
                totalElapsedTime={totalElapsedTime}
                taskElapsedTime={taskElapsedTime}
                averageTimePerTask={averageTimePerTask}
                taskCount={taskCount}
                isRunning={isRunning}
                isOverTime={isOverTime}
                isTaskOverTime={isTaskOverTime}
                onStart={startTimer}
                onPause={pauseTimer}
                onReset={resetTimer}
              />

              <div className="text-center mb-8">
                <button
                  onClick={recordTask}
                  disabled={!isRunning || taskCount >= totalTasks}
                  className={`flex items-center px-6 py-3 rounded-lg mx-auto ${
                    !isRunning || taskCount >= totalTasks
                      ? 'bg-purple-900/30 text-purple-300/50'
                      : 'bg-purple-600 hover:bg-purple-500 text-white'
                  } transition-all duration-300 shadow-lg hover:shadow-purple-500/20`}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  记录目标 ({taskCount}/{totalTasks})
                </button>
              </div>
            </div>
          )}
        </div>

        {showTracker && taskSnapshots.length > 0 && (
          <TaskList
            taskSnapshots={taskSnapshots}
            measureWord={measureWord}
            averageTimePerTask={averageTimePerTask}
          />
        )}
      </div>
    </div>
  );
}

export default App;