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
  totalCompleted: number;
  totalTarget: number;
  measureWord: string;
  records: TaskRecord[];
}