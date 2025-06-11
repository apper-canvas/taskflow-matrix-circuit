import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import TaskList from '@/components/organisms/TaskList';
import ErrorMessage from '@/components/organisms/ErrorMessage';
import LoadingSkeleton from '@/components/organisms/LoadingSkeleton';
import NoContentMessage from '@/components/organisms/NoContentMessage';
import { taskService } from '@/services';

const ArchivePage = () => {
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
    setArchivedTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));

    try {
      await taskService.update(taskId, { archived: false });
      toast.success('Task restored');
    } catch (err) {
      const tasks = await taskService.getAll();
      const archived = tasks.filter(task => task.archived);
      setArchivedTasks(archived);
      toast.error('Failed to restore task');
    }
  };

  const handleTaskDelete = async (taskId) => {
    setArchivedTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));

    try {
      await taskService.delete(taskId);
      toast.success('Task permanently deleted');
    } catch (err) {
      const tasks = await taskService.getAll();
      const archived = tasks.filter(task => task.archived);
      setArchivedTasks(archived);
      toast.error('Failed to delete task');
    }
  };

  if (loading) {
    return <LoadingSkeleton type="archive" />;
  }

  if (error) {
    return <ErrorMessage message={error} onReloadClick={() => window.location.reload()} />;
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-surface-900">Archive</h1>
        <p className="text-surface-600 font-body">
          {archivedTasks.length} archived tasks
        </p>
      </div>
      {archivedTasks.length === 0 ? (
        <NoContentMessage
          iconName="Archive"
          title="No archived tasks"
          description="Completed tasks will appear here when archived"
        />
      ) : (
        <TaskList
          tasks={archivedTasks}
          onTaskDelete={handleTaskDelete}
          onRestore={handleTaskRestore}
          isArchivedList={true}
        />
      )}
    </div>
  );
};

export default ArchivePage;