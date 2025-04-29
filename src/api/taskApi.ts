import { TaskResponse, TaskStatusResponse } from '../types';

// Mock response delay to simulate network latency
const randomDelay = (min: number, max: number) => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Simulate task processing
const mockTaskProcessing = async (
  taskId: string, 
  onStatusUpdate: (status: TaskStatusResponse) => void
) => {
  // Set initial status to processing
  onStatusUpdate({ status: 'processing', progress: 0 });
  
  try {
    // Simulate 5-10 second processing time with progress updates
    const totalSteps = 10;
    const processTime = 5000 + Math.random() * 5000; // 5-10 seconds
    const stepTime = processTime / totalSteps;
    
    for (let step = 1; step <= totalSteps; step++) {
      await randomDelay(stepTime * 0.8, stepTime * 1.2);
      
      // Check for cancellation flag (stored in localStorage for this mock)
      if (localStorage.getItem(`cancel_${taskId}`) === 'true') {
        onStatusUpdate({
          status: 'cancelled',
          message: 'Task was cancelled',
        });
        return;
      }
      
      // Random chance of error (10%)
      if (Math.random() < 0.1 && step > 3) {
        throw new Error('Simulated processing error');
      }
      
      // Update progress
      const progress = Math.round((step / totalSteps) * 100);
      onStatusUpdate({
        status: 'processing',
        progress,
        message: `Processing file (${progress}%)`,
      });
    }
    
    // Complete successfully
    onStatusUpdate({
      status: 'success',
      progress: 100,
      message: 'File processed successfully',
    });
  } catch (error) {
    // Handle error
    onStatusUpdate({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

// Mock upload API
export const uploadFile = async (file: File): Promise<TaskResponse> => {
  // Simulate network delay
  await randomDelay(500, 1500);
  
  // 15% chance of upload error
  if (Math.random() < 0.15) {
    throw new Error('Network error during upload');
  }
  
  // Return mock task ID
  const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  return { task_id: taskId };
};

// Mock status API
export const getTaskStatus = async (taskId: string): Promise<TaskStatusResponse> => {
  // Simulate network delay
  await randomDelay(200, 800);
  
  // 10% chance of network error
  if (Math.random() < 0.1) {
    throw new Error('Network error while checking status');
  }
  
  // Get status from local store or return pending
  const status = localStorage.getItem(`status_${taskId}`);
  if (status) {
    return JSON.parse(status);
  }
  
  return { status: 'pending' };
};

// Initiate task processing
export const initiateTaskProcessing = (taskId: string) => {
  // Clear any existing cancellation
  localStorage.removeItem(`cancel_${taskId}`);
  
  // Start the mock processing
  mockTaskProcessing(taskId, (status) => {
    localStorage.setItem(`status_${taskId}`, JSON.stringify(status));
  });
};

// Cancel a task
export const cancelTask = (taskId: string) => {
  localStorage.setItem(`cancel_${taskId}`, 'true');
};
