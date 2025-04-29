export type TaskStatus = 'pending' | 'processing' | 'success' | 'error' | 'cancelled';

export interface Task {
  id: string;
  filename: string;
  fileSize: number;
  fileType: string;
  status: TaskStatus;
  progress?: number;
  message?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface TaskResponse {
  task_id: string;
}

export interface TaskStatusResponse {
  status: TaskStatus;
  progress?: number;
  message?: string;
  error?: string;
}