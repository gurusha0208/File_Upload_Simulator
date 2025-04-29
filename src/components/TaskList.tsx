import React, { useEffect } from 'react';
import { Task } from '../types';
import TaskItem from './TaskItem';
import useTaskPolling from '../hooks/useTaskPolling';

interface TaskListProps {
  tasks: Task[];
  onCancelTask: (taskId: string) => void;
}

const TaskList = ({ tasks, onCancelTask }: TaskListProps) => {
  const { startPolling, stopPolling } = useTaskPolling();
  
  useEffect(() => {
    // Start polling for tasks that need monitoring
    tasks.forEach((task) => {
      if (task.status === 'pending' || task.status === 'processing') {
        startPolling(task.id);
      }
    });
    
    // Cleanup on unmount
    return () => {
      tasks.forEach((task) => {
        stopPolling(task.id);
      });
    };
  }, [tasks, startPolling, stopPolling]);

  if (tasks.length === 0) {
    return <p className="text-gray-500 text-center py-8">No upload tasks yet</p>;
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem 
          key={task.id} 
          task={task} 
          onCancel={() => onCancelTask(task.id)} 
        />
      ))}
    </div>
  );
};

export default TaskList;