import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import TaskCard from '../components/TaskCard';
import { taskService } from '../services';

const Archive = () => {
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadArchivedTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        const tasks = await taskService.getAll();
        const archived = tasks.filter(task => task.archived);
        setArchivedTasks(archived);
      } catch (err) {
        setError(err.message || 'Failed to load archived tasks');
        toast.error('Failed to load archived tasks');
      } finally {
        setLoading(false);
      }
    };
    loadArchivedTasks();
  }, []);

  const handleTaskRestore = async (taskId) => {
    // Optimistic update
    setArchivedTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));

    try {
      await taskService.update(taskId, { archived: false });
      toast.success('Task restored');
    } catch (err) {
      // Reload on error
      const tasks = await taskService.getAll();
      const archived = tasks.filter(task => task.archived);
      setArchivedTasks(archived);
      toast.error('Failed to restore task');
    }
  };

  const handleTaskDelete = async (taskId) => {
    // Optimistic update
    setArchivedTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));

    try {
      await taskService.delete(taskId);
      toast.success('Task permanently deleted');
    } catch (err) {
      // Reload on error
      const tasks = await taskService.getAll();
      const archived = tasks.filter(task => task.archived);
      setArchivedTasks(archived);
      toast.error('Failed to delete task');
    }
  };

  if (loading) {
    return (
      <div className="h-full p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-surface-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">Something went wrong</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:brightness-110 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (archivedTasks.length === 0) {
    return (
      <div className="h-full p-6">
        <h1 className="text-2xl font-display font-bold text-surface-900 mb-6">Archive</h1>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="Archive" className="w-16 h-16 text-surface-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium text-surface-900">No archived tasks</h3>
          <p className="mt-2 text-surface-500">Completed tasks will appear here when archived</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-surface-900">Archive</h1>
        <p className="text-surface-600 font-body">
          {archivedTasks.length} archived tasks
        </p>
      </div>

      <div className="space-y-4">
        {archivedTasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <TaskCard
              task={task}
              onComplete={() => {}}
              onDelete={handleTaskDelete}
              onEdit={() => {}}
              isArchived={true}
              onRestore={handleTaskRestore}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Archive;