import React, { useMemo } from 'react';
import { Task, TaskStatus } from '../types';

interface TaskItemProps {
  task: Task;
  onCancel: () => void;
}

const TaskItem = ({ task, onCancel }: TaskItemProps) => {
  const statusInfo = useMemo(() => {
    const info = {
      icon: '',
      color: '',
      label: '',
      showProgress: false,
      showCancel: false,
    };
    
    switch (task.status) {
      case 'pending':
        info.icon = '⏳';
        info.color = 'text-yellow-600';
        info.label = 'Pending';
        info.showCancel = true;
        break;
      case 'processing':
        info.icon = '⚙️';
        info.color = 'text-blue-600';
        info.label = 'Processing';
        info.showProgress = true;
        info.showCancel = true;
        break;
      case 'success':
        info.icon = '✅';
        info.color = 'text-green-600';
        info.label = 'Completed';
        break;
      case 'error':
        info.icon = '❌';
        info.color = 'text-red-600';
        info.label = 'Failed';
        break;
      case 'cancelled':
        info.icon = '🚫';
        info.color = 'text-gray-600';
        info.label = 'Cancelled';
        break;
    }
    
    return info;
  }, [task.status]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }).format(date);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <div className="p-4 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center">
            <span className="mr-2 text-xl">{statusInfo.icon}</span>
            <h3 className="font-medium truncate" title={task.filename}>
              {task.filename}
            </h3>
          </div>
          
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
            <span>{formatFileSize(task.fileSize)}</span>
            <span>Started: {formatDate(task.createdAt)}</span>
            {task.completedAt && <span>Completed: {formatDate(task.completedAt)}</span>}
          </div>
          
          {task.message && (
            <p className={`mt-2 text-sm ${
              task.status === 'error' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {task.message}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <span className={`font-medium ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
          
          {statusInfo.showCancel && (
            <button
              onClick={onCancel}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100"
              aria-label="Cancel task"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
      
      {statusInfo.showProgress && task.progress !== undefined && (
        <div className="h-1 w-full bg-gray-200">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${Math.max(5, task.progress)}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default TaskItem;