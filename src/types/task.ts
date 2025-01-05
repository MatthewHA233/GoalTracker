export interface Task {
  id: string;
  name: string;
  created_at: string;
}

export interface TaskSnapshot {
  taskNumber: number;
  taskTime: number;
  totalTime: number;
}

export interface TaskRecord {
  id: string;
  created_at: string;
  total_tasks: number;
  completed_count: number;
  measure_word: string;
  average_time: number;
}

export interface TaskStats {
  name: string;
  totalAverage: number;
  suggestedAverage: number;
  totalCompleted: number;
  totalTarget: number;
  measureWord: string;
  speedAdjustment: number;
  sampleSize: number | null;
  records: TaskRecord[];
}

export interface TaskSuggestion {
  measureWord: string;
  averageTime: number;
  speedAdjustment: number;
  sampleSize: number | null;
}