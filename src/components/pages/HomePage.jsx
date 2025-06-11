import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { taskService } from '@/services/api/taskService';
import { categoryService } from '@/services/api/categoryService';
import TaskList from '@/components/organisms/TaskList';
import CategorySidebar from '@/components/organisms/CategorySidebar';
import PageHeader from '@/components/organisms/PageHeader';
import AddTaskForm from '@/components/organisms/AddTaskForm';
import LoadingSkeleton from '@/components/organisms/LoadingSkeleton';
import ErrorMessage from '@/components/organisms/ErrorMessage';
import NoContentMessage from '@/components/organisms/NoContentMessage';
import SearchInputWithClear from '@/components/molecules/SearchInputWithClear';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      
      // Transform database fields to UI format
      const transformedTasks = tasksData.map(task => ({
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

      const transformedCategories = categoriesData.map(cat => ({
        id: cat.Id,
        name: cat.Name,
        taskCount: cat.task_count || 0
      }));

      setTasks(transformedTasks);
      setCategories(transformedCategories);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please try again.');
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
};

  const handleAddTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      
      // Transform database response to UI format
      const transformedTask = {
        id: newTask.Id,
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        category: newTask.category,
        dueDate: newTask.due_date ? new Date(newTask.due_date) : null,
        completed: newTask.completed,
        archived: newTask.archived,
        createdAt: newTask.CreatedOn ? new Date(newTask.CreatedOn) : new Date(),
        completedAt: newTask.completed_at ? new Date(newTask.completed_at) : null
      };

      setTasks(prev => [transformedTask, ...prev]);
      setShowAddForm(false);
      toast.success('Task added successfully!');
    } catch (err) {
      console.error('Error adding task:', err);
      toast.error('Failed to add task. Please try again.');
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      const updatedTask = await taskService.update(taskId, {
        ...task,
        completed: !task.completed,
        completedAt: !task.completed ? new Date() : null
      });

      setTasks(prev => prev.map(t => 
        t.id === taskId 
          ? { 
              ...t, 
              completed: !t.completed,
              completedAt: !t.completed ? new Date() : null 
            }
          : t
      ));
      
      toast.success(task.completed ? 'Task marked as incomplete' : 'Task completed!');
    } catch (err) {
      console.error('Error updating task:', err);
      toast.error('Failed to update task');
    }
  };

  const handleEditTask = async (taskId, editedData) => {
    try {
      const updatedTask = await taskService.update(taskId, editedData);
      
      setTasks(prev => prev.map(t => 
        t.id === taskId 
          ? { 
              ...t, 
              ...editedData,
              dueDate: editedData.dueDate
            }
          : t
      ));
      
      toast.success('Task updated successfully!');
    } catch (err) {
      console.error('Error updating task:', err);
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      toast.success('Task deleted successfully!');
    } catch (err) {
      console.error('Error deleting task:', err);
      toast.error('Failed to delete task');
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
            onTaskComplete={handleCompleteTask}
            onTaskDelete={handleDeleteTask}
            onTaskEdit={handleEditTask}
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
                onSubmit={handleAddTask}
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