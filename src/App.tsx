import React, { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { GoalForm } from './components/GoalForm';
import { Timer } from './components/Timer';
import { TaskList } from './components/TaskList';
import { AuthForm } from './components/AuthForm';
import { UserButton } from './components/UserButton';
import { showTaskCompletionNotification } from './utils/notifications';
import { TaskSnapshot } from './types/task';
import { useAuthStore } from './stores/authStore';
import { useTaskStore } from './stores/taskStore';
import { Header } from './components/Header';
import { TrackerPanel } from './components/TrackerPanel';

function App() {
  const { user, loading: authLoading, initialize } = useAuthStore();
  const { createTask, createTaskRecord, recordTaskSnapshot } = useTaskStore();
  
  const [totalTasks, setTotalTasks] = useState(1);
  const [measureWord, setMeasureWord] = useState('个');
  const [totalTime, setTotalTime] = useState(60);
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);
  const [taskElapsedTime, setTaskElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [taskCount, setTaskCount] = useState(0);
  const [taskSnapshots, setTaskSnapshots] = useState<TaskSnapshot[]>([]);
  const [showTracker, setShowTracker] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);
  const [shouldResetTimer, setShouldResetTimer] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

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

  const handleSubmit = async (e: React.FormEvent, taskName: string) => {
    e.preventDefault();
    if (totalTasks <= 0 || totalTime <= 0) {
      alert('请输入有效的任务数和时间。');
      return;
    }

    try {
      const task = await createTask(taskName);
      setCurrentTaskId(task.id);

      const record = await createTaskRecord(
        task.id,
        totalTasks,
        measureWord,
        totalTime
      );
      setCurrentRecordId(record.id);

      setShowTracker(true);
    } catch (error) {
      console.error('Error starting task:', error);
      alert('启动任务时发生错误');
    }
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
    setCurrentTaskId(null);
    setCurrentRecordId(null);
    setShouldResetTimer(false);
  };

  const recordTask = async () => {
    if (!currentRecordId) return;
    
    if (taskCount >= totalTasks) {
      await showTaskCompletionNotification(totalTasks, measureWord, false);
      return;
    }

    const newTaskCount = taskCount + 1;
    const currentTaskTime = taskElapsedTime;
    const currentTotalTime = totalElapsedTime;

    // 先更新状态
    setTaskCount(newTaskCount);
    setShouldResetTimer(true);
    setTaskElapsedTime(0);
    
    const newSnapshot: TaskSnapshot = {
      taskNumber: newTaskCount,
      taskTime: currentTaskTime,
      totalTime: currentTotalTime
    };
    setTaskSnapshots(prev => [newSnapshot, ...prev]);

    try {
      await recordTaskSnapshot(
        currentRecordId,
        newSnapshot.taskNumber,
        newSnapshot.taskTime,
        newSnapshot.totalTime
      );
    } catch (error) {
      console.error('Error recording snapshot:', error);
    }

    if (newTaskCount >= totalTasks) {
      await showTaskCompletionNotification(totalTasks, measureWord, true);
      setIsRunning(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-purple-300">加载中...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const averageTimePerTask = totalTime * 60 / totalTasks;
  const isOverTime = totalElapsedTime > averageTimePerTask * (taskCount + 1);
  const isTaskOverTime = taskElapsedTime > averageTimePerTask;

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-[2000px] mx-auto">
        <div className="max-w-3xl mx-auto mb-8">
          <Header 
            isTimerRunning={isRunning} 
            onTimerPause={pauseTimer}
            showTitle={!showTracker}
          />

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
            <TrackerPanel
              totalElapsedTime={totalElapsedTime}
              taskElapsedTime={taskElapsedTime}
              averageTimePerTask={averageTimePerTask}
              taskCount={taskCount}
              totalTasks={totalTasks}
              isRunning={isRunning}
              isOverTime={isOverTime}
              isTaskOverTime={isTaskOverTime}
              onStart={startTimer}
              onPause={pauseTimer}
              onReset={resetTimer}
              onRecordTask={recordTask}
              shouldResetTimer={shouldResetTimer}
              onTimerReset={() => setShouldResetTimer(false)}
            />
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