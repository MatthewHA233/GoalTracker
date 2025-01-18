import React, { useEffect, useState } from 'react';
import { GoalForm } from './components/GoalForm';
import { Timer } from './components/Timer';
import { TaskList } from './components/TaskList';
import { AuthForm } from './components/AuthForm';
import { UserButton } from './components/UserButton';
import { showTaskCompletionNotification } from './utils/notifications';
import { TaskSnapshot, TaskRecord } from './types/task';
import { useAuthStore } from './stores/authStore';
import { useTaskStore } from './stores/taskStore';
import { Header } from './components/Header';
import { TrackerPanel } from './components/TrackerPanel';
import { supabase } from './lib/supabase';

function App() {
  const { user, loading: authLoading, initialize } = useAuthStore();
  const { createTask, createTaskRecord, recordTaskSnapshot, fetchTaskStats } = useTaskStore();
  
  const [taskName, setTaskName] = useState('');
  const [totalTasks, setTotalTasks] = useState(1);
  const [measureWord, setMeasureWord] = useState('个');
  const [totalTime, setTotalTime] = useState(60);
  const [totalTimeLimit, setTotalTimeLimit] = useState(0);
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);
  const [taskElapsedTime, setTaskElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [taskCount, setTaskCount] = useState(0);
  const [taskSnapshots, setTaskSnapshots] = useState<TaskSnapshot[]>([]);
  const [showTracker, setShowTracker] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);
  const [shouldResetTimer, setShouldResetTimer] = useState(false);
  const [averageTimePerTask, setAverageTimePerTask] = useState(60);

  useEffect(() => {
    if (user) {
      fetchTaskStats();
    }
  }, [user, fetchTaskStats]);

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

  const handleSubmit = async (e: React.FormEvent, name: string) => {
    e.preventDefault();
    if (totalTasks <= 0 || totalTime <= 0) {
      alert('请输入有效的任务数和时间。');
      return;
    }

    try {
      const task = await createTask(name);
      setTaskName(name);
      setCurrentTaskId(task.id);

      const totalMinutes = Math.ceil(totalTime);
      const record = await createTaskRecord(
        task.id,
        totalTasks,
        measureWord,
        totalMinutes
      );
      setCurrentRecordId(record.id);
      
      setTotalTimeLimit(totalTime * 60);
      setAverageTimePerTask(totalTime * 60 / totalTasks);
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
    setTaskName('');
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

  const handleContinueRecord = (record: TaskRecord, taskName: string) => {
    setTaskName(taskName);
    setTotalTasks(record.total_tasks);
    setMeasureWord(record.measure_word);
    setTotalTime(record.total_time_minutes);
    setTaskCount(record.completed_count);
    setCurrentTaskId(record.task_id);
    setCurrentRecordId(record.id);
    setTotalTimeLimit(record.total_time_minutes * 60);
    setAverageTimePerTask(record.total_time_minutes * 60 / record.total_tasks);
    setShowTracker(true);
  };

  const handleTotalTimeChange = (minutes: number) => {
    setTotalTime(minutes);
    setTotalTimeLimit(minutes * 60);
    setAverageTimePerTask(minutes * 60 / totalTasks);
  };

  const handleTotalTasksChange = async (count: number) => {
    if (count < taskCount + 1) return;
    
    // 更新数据库中的总任务数
    if (currentRecordId) {
      try {
        await supabase
          .from('task_records')
          .update({ total_tasks: count })
          .eq('id', currentRecordId);
        
        // 更新本地状态
        setTotalTasks(count);
        setAverageTimePerTask(totalTimeLimit / count);
        
        // 刷新任务统计数据
        await fetchTaskStats();
      } catch (error) {
        console.error('Error updating total tasks:', error);
        alert('更新总任务数失败');
      }
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-[2000px] mx-auto">
        <div className="max-w-3xl mx-auto mb-8">
          <Header 
            isTimerRunning={isRunning} 
            onTimerPause={pauseTimer}
            showTitle={!showTracker}
            onContinueRecord={handleContinueRecord}
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
              onContinueRecord={handleContinueRecord}
            />
          ) : (
            <TrackerPanel
              totalElapsedTime={totalElapsedTime}
              taskElapsedTime={taskElapsedTime}
              averageTimePerTask={averageTimePerTask}
              taskCount={taskCount}
              totalTasks={totalTasks}
              totalTimeLimit={totalTimeLimit}
              isRunning={isRunning}
              isOverTime={totalElapsedTime > averageTimePerTask * (taskCount + 1)}
              isTaskOverTime={taskElapsedTime > averageTimePerTask}
              shouldResetTimer={shouldResetTimer}
              taskName={taskName}
              onStart={startTimer}
              onPause={pauseTimer}
              onReset={resetTimer}
              onRecordTask={recordTask}
              onTimerReset={() => setShouldResetTimer(false)}
              onTotalTimeChange={handleTotalTimeChange}
              onTotalTasksChange={handleTotalTasksChange}
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