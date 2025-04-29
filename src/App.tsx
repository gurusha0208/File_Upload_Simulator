import { useState } from 'react';
import FileUploader from './components/FileUploader';
import TaskList from './components/TaskList';
import { Task } from './types';
import './App.css';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (task: Task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  };

  const cancelTask = (taskId: string) => {
    updateTask(taskId, { status: 'cancelled', message: 'Task cancelled by user' });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">File Upload System</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <FileUploader onTaskCreated={addTask} />
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Tasks</h2>
          <TaskList tasks={tasks} onCancelTask={cancelTask} />
        </div>
      </div>
    </div>
  );
}

export default App;