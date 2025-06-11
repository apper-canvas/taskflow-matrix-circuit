import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import AddTaskForm from '@/components/organisms/AddTaskForm';
import TaskList from '@/components/organisms/TaskList';
import CategorySidebar from '@/components/organisms/CategorySidebar';
import PageHeader from '@/components/organisms/PageHeader';
import ErrorMessage from '@/components/organisms/ErrorMessage';
import LoadingSkeleton from '@/components/organisms/LoadingSkeleton';
import { taskService, categoryService } from '@/services';

const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('priority');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [tasksResult, categoriesResult] = await Promise.all([
          taskService.getAll(),
          categoryService.getAll()
        ]);
        setTasks(tasksResult);
        setCategories(categoriesResult);
      } catch (err) {
        setError(err.message || 'Failed to load data');
        toast.error('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleTaskComplete = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Optimistic update
    setTasks(prevTasks => 
      prevTasks.map(t => 
        t.id === taskId 
          ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date() : null }
          : t
      )
    );

    try {
      await taskService.update(taskId, { 
        completed: !task.completed,
        completedAt: !task.completed ? new Date() : null
      });
      toast.success(task.completed ? 'Task reopened' : 'Task completed!');
    } catch (err) {
      // Rollback on error
      setTasks(prevTasks => 
        prevTasks.map(t => 
          t.id === taskId 
            ? { ...t, completed: task.completed, completedAt: task.completedAt }
            : t
        )
      );
      toast.error('Failed to update task');
    }
  };

  const handleTaskDelete = async (taskId) => {
    // Optimistic update
    setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));

    try {
      await taskService.delete(taskId);
      toast.success('Task deleted');
    } catch (err) {
      // Reload on error
      const tasksResult = await taskService.getAll();
      setTasks(tasksResult);
      toast.error('Failed to delete task');
    }
  };

  const handleTaskAdd = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prevTasks => [newTask, ...prevTasks]);
      setShowAddForm(false);
      toast.success('Task created');
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  const handleTaskEdit = async (taskId, taskData) => {
    // Optimistic update
    setTasks(prevTasks => 
      prevTasks.map(t => 
        t.id === taskId ? { ...t, ...taskData } : t
      )
    );

    try {
      await taskService.update(taskId, taskData);
      toast.success('Task updated');
    } catch (err) {
      // Reload on error
      const tasksResult = await taskService.getAll();
      setTasks(tasksResult);
      toast.error('Failed to update task');
    }
  };

  const activeTasks = tasks.filter(task => !task.archived);
  
  const filteredTasks = activeTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (sortBy === 'dueDate') {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const completedToday = tasks.filter(task => {
    if (!task.completed || !task.completedAt) return false;
    const today = new Date();
    const completedDate = new Date(task.completedAt);
    return today.toDateString() === completedDate.toDateString();
  }).length;

  const totalTasksToday = tasks.filter(task => {
    const today = new Date();
    const taskDate = new Date(task.createdAt);
    return today.toDateString() === taskDate.toDateString() || task.completed;
  }).length;

  if (loading) {
    return <LoadingSkeleton type="home" />;
  }

  if (error) {
    return <ErrorMessage message={error} onReloadClick={() => window.location.reload()} />;
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <PageHeader
        title="Today's Tasks"
        subtitle={`${completedToday} of ${totalTasksToday} tasks completed`}
        completedCount={completedToday}
        totalCount={totalTasksToday}
        onAddTaskClick={() => setShowAddForm(true)}
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        onClearSearch={() => setSearchQuery('')}
        sortBy={sortBy}
        onSortChange={(e) => setSortBy(e.target.value)}
      />

      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 bg-white border-r overflow-y-auto">
          <CategorySidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            tasks={activeTasks}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <TaskList
            tasks={sortedTasks}
            onTaskComplete={handleTaskComplete}
            onTaskDelete={handleTaskDelete}
            onTaskEdit={handleTaskEdit}
            searchQuery={searchQuery}
            categories={categories}
          />
        </div>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowAddForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <AddTaskForm
                categories={categories}
                onSubmit={handleTaskAdd}
                onCancel={() => setShowAddForm(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;