import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { getTaskStatus, initiateTaskProcessing } from '../api/taskApi';

const POLLING_INTERVAL = 2000; // 2 seconds
const MAX_RETRIES = 3;

const useTaskPolling = () => {
  const { updateTask } = useTaskContext();
  type PollingTask = {
    intervalId: number;
    retries: number;
  };
  
  const pollingTasks = useRef<Record<string, PollingTask>>({});
  
  const startPolling = useCallback((taskId: string) => {
    // If already polling this task, clear the interval first
    if (pollingTasks.current[taskId]) {
      stopPolling(taskId);
    }
    
    // Start the simulated task processing
    initiateTaskProcessing(taskId);
    
    // Start polling for status updates
    const intervalId = window.setInterval(async () => {
      try {
        const taskStatus = await getTaskStatus(taskId);
        
        // Update task in context with new status
        updateTask(taskId, {
          status: taskStatus.status,
          progress: taskStatus.progress,
          message: taskStatus.message || taskStatus.error,
          ...(taskStatus.status === 'success' || 
             taskStatus.status === 'error' || 
             taskStatus.status === 'cancelled' 
             ? { completedAt: new Date() } : {}),
        });
        
        // Reset retries on successful poll
        if (pollingTasks.current[taskId]) {
          pollingTasks.current[taskId].retries = 0;
        }
        
        // If task is complete or failed, stop polling
        if (taskStatus.status === 'success' || 
            taskStatus.status === 'error' || 
            taskStatus.status === 'cancelled') {
          stopPolling(taskId);
        }
      } catch (error) {
        // Track retry attempts
        const taskInfo = pollingTasks.current[taskId];
        if (taskInfo) {
          taskInfo.retries += 1;
          
          // If max retries reached, stop polling and mark as error
          if (taskInfo.retries >= MAX_RETRIES) {
            updateTask(taskId, {
              status: 'error',
              message: 'Failed to check status after multiple attempts',
              completedAt: new Date(),
            });
            stopPolling(taskId);
          }
        }
      }
    }, POLLING_INTERVAL);
    
    // Store interval ID for cleanup
    pollingTasks.current[taskId] = {
      intervalId,
      retries: 0,
    };
  }, [updateTask]);
  
  const stopPolling = useCallback((taskId: string) => {
    if (pollingTasks.current[taskId]) {
      clearInterval(pollingTasks.current[taskId].intervalId);
      delete pollingTasks.current[taskId];
    }
  }, []);
  
  // Clean up all polling intervals on unmount
  useEffect(() => {
    return () => {
      Object.entries(pollingTasks.current).forEach(([taskId, { intervalId }]) => {
        clearInterval(intervalId);
      });
    };
  }, []);

  return { startPolling, stopPolling };
};

export default useTaskPolling;