import React, { createContext, useContext, useState, useCallback } from 'react';
import { Task } from '../types';
import { cancelTask as apiCancelTask } from '../api/taskApi';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  cancelTask: (taskId: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  
  const addTask = useCallback((task: Task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  }, []);
  
  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  }, []);
  
  const cancelTask = useCallback((taskId: string) => {
    // Call API to cancel the task
    apiCancelTask(taskId);
    
    // Update local state
    updateTask(taskId, { 
      status: 'cancelled', 
      message: 'Task cancelled by user',
      completedAt: new Date()
    });
  }, [updateTask]);

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, cancelTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
