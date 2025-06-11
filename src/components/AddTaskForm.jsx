import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from './ApperIcon';

const AddTaskForm = ({ categories, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: categories[0]?.name || '',
    dueDate: ''
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const taskData = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
      completed: false,
      archived: false,
      createdAt: new Date(),
      completedAt: null
    };

    onSubmit(taskData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-bold text-surface-900">Add New Task</h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onCancel}
          className="p-1 text-surface-400 hover:text-surface-600 transition-colors"
        >
          <ApperIcon name="X" size={20} />
        </motion.button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">
            Task Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="What needs to be done?"
            className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
              errors.title ? 'border-error' : 'border-surface-300'
            }`}
          />
          {errors.title && (
            <p className="text-error text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Add more details..."
            rows={3}
            className="w-full px-3 py-3 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">
            Priority
          </label>
          <div className="flex gap-2">
            {['high', 'medium', 'low'].map((priority) => (
              <motion.button
                key={priority}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleChange('priority', priority)}
                className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                  formData.priority === priority
                    ? priority === 'high'
                      ? 'bg-accent/10 border-accent text-accent'
                      : priority === 'medium'
                        ? 'bg-warning/10 border-warning text-warning'
                        : 'bg-success/10 border-success text-success'
                    : 'border-surface-300 text-surface-600 hover:border-surface-400'
                }`}
              >
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-3 py-3 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">
            Due Date
          </label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
            min={format(new Date(), 'yyyy-MM-dd')}
            className="w-full px-3 py-3 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCancel}
            className="flex-1 py-3 border border-surface-300 text-surface-700 rounded-lg hover:bg-surface-50 transition-all font-medium"
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-3 bg-primary text-white rounded-lg hover:brightness-110 transition-all font-medium"
          >
            Add Task
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default AddTaskForm;