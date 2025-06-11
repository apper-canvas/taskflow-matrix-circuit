import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { taskService } from '@/services/api/taskService';
import TaskList from '@/components/organisms/TaskList';
import PageHeader from '@/components/organisms/PageHeader';
import LoadingSkeleton from '@/components/organisms/LoadingSkeleton';
import ErrorMessage from '@/components/organisms/ErrorMessage';
import NoContentMessage from '@/components/organisms/NoContentMessage';
import SearchInputWithClear from '@/components/molecules/SearchInputWithClear';
const ArchivePage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadArchivedTasks();
  }, []);

  const loadArchivedTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const tasksData = await taskService.getAll();
      
      // Transform and filter archived tasks
      const archivedTasks = tasksData
        .filter(task => task.archived)
        .map(task => ({
          id: task.Id,
          title: task.title,
          description: task.description,
          priority: task.priority,
          category: task.category,
          dueDate: task.due_date ? new Date(task.due_date) : null,
          completed: task.completed,
          archived: task.archived,
          createdAt: task.CreatedOn ? new Date(task.CreatedOn) : new Date(),
          completedAt: task.completed_at ? new Date(task.completed_at) : null
        }));

      setTasks(archivedTasks);
    } catch (err) {
      console.error('Error loading archived tasks:', err);
      setError('Failed to load archived tasks. Please try again.');
      toast.error('Failed to load archived tasks');
    } finally {
setLoading(false);
    }
  };

  const handleRestoreTask = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      await taskService.update(taskId, {
        ...task,
        archived: false
      });

      setTasks(prev => prev.filter(t => t.id !== taskId));
      toast.success('Task restored successfully!');
    } catch (err) {
      console.error('Error restoring task:', err);
      toast.error('Failed to restore task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      toast.success('Task permanently deleted!');
    } catch (err) {
      console.error('Error deleting task:', err);
      toast.error('Failed to delete task');
    }
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadArchivedTasks} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader>
        <div>
          <h1 className="text-2xl font-display font-bold text-surface-900">Archive</h1>
          <p className="text-surface-600 font-body">
            {tasks.length} archived tasks
          </p>
        </div>
      </PageHeader>

      {tasks.length > 0 && (
        <SearchInputWithClear
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search archived tasks..."
        />
      )}

      {filteredTasks.length === 0 ? (
        <NoContentMessage
          iconName="Archive"
          title={searchQuery ? "No matching archived tasks" : "No archived tasks"}
          description={searchQuery ? "Try adjusting your search terms" : "Completed tasks will appear here when archived"}
        />
      ) : (
        <TaskList
          tasks={filteredTasks}
          onTaskDelete={handleDeleteTask}
          onRestore={handleRestoreTask}
          isArchivedList={true}
        />
      )}
    </div>
  );
};

export default ArchivePage;