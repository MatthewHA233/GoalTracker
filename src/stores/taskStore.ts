import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Task, TaskStats, TaskSuggestion } from '../types/task';

interface TaskState {
  tasks: Task[];
  taskStats: TaskStats[];
  loading: boolean;
  fetchTasks: () => Promise<void>;
  fetchTaskStats: () => Promise<void>;
  createTask: (name: string) => Promise<Task>;
  deleteTask: (taskName: string) => Promise<void>;
  deleteTaskRecord: (recordId: string) => Promise<void>;
  getCurrentRecord: (taskId: string) => Promise<any>;
  createTaskRecord: (taskId: string, totalTasks: number, measureWord: string, totalTimeMinutes: number) => Promise<any>;
  recordTaskSnapshot: (recordId: string, taskNumber: number, taskTimeSeconds: number, totalTimeSeconds: number) => Promise<void>;
  getTaskSuggestion: (taskName: string) => TaskSuggestion | null;
  updateTaskSuggestion: (taskName: string, settings: { speedAdjustment: number; sampleSize: number | null }) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  taskStats: [],
  loading: false,

  fetchTasks: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // 去重任务名称
      const uniqueTasks = data.reduce((acc: Task[], curr) => {
        if (!acc.some(task => task.name === curr.name)) {
          acc.push(curr);
        }
        return acc;
      }, []);
      
      set({ tasks: uniqueTasks });
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      set({ loading: false });
    }
  },

  fetchTaskStats: async () => {
    try {
      const { data, error } = await supabase
        .from('task_records')
        .select(`
          id,
          task_id,
          total_tasks,
          completed_count,
          measure_word,
          created_at,
          tasks (
            name
          ),
          task_snapshots (
            task_time_seconds
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const statsMap = new Map<string, TaskStats>();

      data.forEach((record: any) => {
        const taskName = record.tasks.name;
        const averageTime = record.task_snapshots.reduce(
          (sum: number, snapshot: any) => sum + snapshot.task_time_seconds, 
          0
        ) / (record.completed_count || 1);

        if (!statsMap.has(taskName)) {
          statsMap.set(taskName, {
            name: taskName,
            totalAverage: 0,
            suggestedAverage: 0,
            totalCompleted: 0,
            totalTarget: 0,
            measureWord: record.measure_word,
            speedAdjustment: 0,
            sampleSize: null,
            records: []
          });
        }

        const stat = statsMap.get(taskName)!;
        stat.totalCompleted += record.completed_count;
        stat.totalTarget += record.total_tasks;
        stat.records.push({
          id: record.id,
          created_at: record.created_at,
          total_tasks: record.total_tasks,
          completed_count: record.completed_count,
          measure_word: record.measure_word,
          average_time: averageTime
        });
      });

      // 计算总平均时间和建议时间
      statsMap.forEach(stat => {
        const totalTime = stat.records.reduce(
          (sum, record) => sum + (record.average_time * record.completed_count),
          0
        );
        stat.totalAverage = totalTime / stat.totalCompleted;
        stat.suggestedAverage = Math.round(stat.totalAverage * (1 + stat.speedAdjustment / 100));
      });

      set({ taskStats: Array.from(statsMap.values()) });
    } catch (error) {
      console.error('Error fetching task stats:', error);
    }
  },

  getTaskSuggestion: (taskName: string) => {
    const stats = get().taskStats;
    const taskStat = stats.find(stat => stat.name === taskName);
    
    if (!taskStat || taskStat.totalCompleted === 0) return null;

    return {
      measureWord: taskStat.measureWord,
      averageTime: taskStat.suggestedAverage,
      speedAdjustment: taskStat.speedAdjustment,
      sampleSize: taskStat.sampleSize
    };
  },

  updateTaskSuggestion: (taskName: string, settings: { speedAdjustment: number; sampleSize: number | null }) => {
    const stats = get().taskStats;
    const updatedStats = stats.map(stat => {
      if (stat.name === taskName) {
        return {
          ...stat,
          speedAdjustment: settings.speedAdjustment,
          sampleSize: settings.sampleSize,
          suggestedAverage: Math.round(stat.totalAverage * (1 + settings.speedAdjustment / 100))
        };
      }
      return stat;
    });
    set({ taskStats: updatedStats });
  },

  createTask: async (name: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('未登录');

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ 
        name,
        user_id: user.id
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    const { tasks } = get();
    if (!tasks.some(task => task.name === data.name)) {
      set({ tasks: [data, ...tasks] });
    }
    return data;
  },

  deleteTask: async (taskName: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('name', taskName);
    
    if (error) throw error;
    
    const { tasks } = get();
    set({ tasks: tasks.filter(task => task.name !== taskName) });
    await get().fetchTaskStats();
  },

  deleteTaskRecord: async (recordId: string) => {
    const { error } = await supabase
      .from('task_records')
      .delete()
      .eq('id', recordId);
    
    if (error) throw error;
    await get().fetchTaskStats();
  },

  getCurrentRecord: async (taskId: string) => {
    const { data, error } = await supabase
      .from('task_records')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  createTaskRecord: async (taskId: string, totalTasks: number, measureWord: string, totalTimeMinutes: number) => {
    const { data, error } = await supabase
      .from('task_records')
      .insert([{
        task_id: taskId,
        total_tasks: totalTasks,
        measure_word: measureWord,
        total_time_minutes: totalTimeMinutes,
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  recordTaskSnapshot: async (recordId: string, taskNumber: number, taskTimeSeconds: number, totalTimeSeconds: number) => {
    const { error } = await supabase
      .from('task_snapshots')
      .insert([{
        task_record_id: recordId,
        task_number: taskNumber,
        task_time_seconds: taskTimeSeconds,
        total_time_seconds: totalTimeSeconds,
      }]);
    
    if (error) throw error;

    // 更新完成数量
    await supabase
      .from('task_records')
      .update({ completed_count: taskNumber })
      .eq('id', recordId);

    await get().fetchTaskStats();
  }
}));