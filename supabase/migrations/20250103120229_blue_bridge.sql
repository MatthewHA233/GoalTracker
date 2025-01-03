/*
  # Initial Schema Setup

  1. New Tables
    - `users` (由 Supabase Auth 自动管理)
    - `tasks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `name` (text)
      - `created_at` (timestamp)
    - `task_records`
      - `id` (uuid, primary key)
      - `task_id` (uuid, foreign key)
      - `total_tasks` (integer)
      - `measure_word` (text)
      - `total_time_minutes` (integer)
      - `completed_count` (integer)
      - `started_at` (timestamp)
      - `created_at` (timestamp)
    - `task_snapshots`
      - `id` (uuid, primary key)
      - `task_record_id` (uuid, foreign key)
      - `task_number` (integer)
      - `task_time_seconds` (integer)
      - `total_time_seconds` (integer)
      - `created_at` (timestamp)

  2. Security
    - 启用所有表的 RLS
    - 添加基于用户身份的访问策略
*/

-- Tasks table
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own tasks"
  ON tasks
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Task records table
CREATE TABLE task_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
  total_tasks integer NOT NULL,
  measure_word text NOT NULL,
  total_time_minutes integer NOT NULL,
  completed_count integer DEFAULT 0,
  started_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE task_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their task records"
  ON task_records
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM tasks 
    WHERE tasks.id = task_records.task_id 
    AND tasks.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM tasks 
    WHERE tasks.id = task_records.task_id 
    AND tasks.user_id = auth.uid()
  ));

-- Task snapshots table
CREATE TABLE task_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_record_id uuid REFERENCES task_records(id) ON DELETE CASCADE NOT NULL,
  task_number integer NOT NULL,
  task_time_seconds integer NOT NULL,
  total_time_seconds integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE task_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their task snapshots"
  ON task_snapshots
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM task_records 
    JOIN tasks ON tasks.id = task_records.task_id 
    WHERE task_snapshots.task_record_id = task_records.id 
    AND tasks.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM task_records 
    JOIN tasks ON tasks.id = task_records.task_id 
    WHERE task_snapshots.task_record_id = task_records.id 
    AND tasks.user_id = auth.uid()
  ));