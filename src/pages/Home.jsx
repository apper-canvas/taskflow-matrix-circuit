import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import MainFeature from '../components/MainFeature';
import TaskCard from '../components/TaskCard';
import AddTaskForm from '../components/AddTaskForm';
import ProgressRing from '../components/ProgressRing';
import CategoryFilter from '../components/CategoryFilter';
import { taskService, categoryService } from '../services';

const Home = () => {
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

  // Filter and sort tasks
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
    return (
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-shrink-0 p-6 bg-white border-b">
          <div className="animate-pulse">
            <div className="h-8 bg-surface-200 rounded w-48 mb-4"></div>
            <div className="h-4 bg-surface-200 rounded w-32"></div>
          </div>
        </div>
        <div className="flex-1 flex overflow-hidden">
          <div className="w-64 bg-white border-r p-6">
            <div className="animate-pulse space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 bg-surface-200 rounded"></div>
              ))}
            </div>
          </div>
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm"
                >
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                    <div className="h-3 bg-surface-200 rounded w-1/2"></div>
                  </div>
                </motion.div>
              ))}
            </div>
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

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-6 bg-white border-b">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold text-surface-900">Today's Tasks</h1>
            <p className="text-surface-600 font-body">
              {completedToday} of {totalTasksToday} tasks completed
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ProgressRing completed={completedToday} total={totalTasksToday} />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:brightness-110 transition-all"
            >
              <ApperIcon name="Plus" size={20} />
              Add Task
            </motion.button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" size={20} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-400 hover:text-surface-600"
            >
              <ApperIcon name="X" size={16} />
            </button>
          )}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="priority">Sort by Priority</option>
            <option value="dueDate">Sort by Due Date</option>
            <option value="created">Sort by Created</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Category Sidebar */}
        <div className="w-64 bg-white border-r overflow-y-auto">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            tasks={activeTasks}
          />
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto p-6">
          <MainFeature
            tasks={sortedTasks}
            onTaskComplete={handleTaskComplete}
            onTaskDelete={handleTaskDelete}
            onTaskEdit={handleTaskEdit}
            searchQuery={searchQuery}
          />
        </div>
      </div>

      {/* Add Task Modal */}
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

export default Home;