import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import FormField from '@/components/molecules/FormField';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import PrioritySelector from '@/components/molecules/PrioritySelector';
import Button from '@/components/atoms/Button';

const AddTaskForm = ({ categories, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: categories[0]?.name || '',
    dueDate: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Set initial category if categories load after component mounts
    if (categories.length > 0 && !formData.category) {
      setFormData(prev => ({ ...prev, category: categories[0].name }));
    }
  }, [categories, formData.category]);

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
        <Button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onCancel}
          className="p-1 text-surface-400 hover:text-surface-600 transition-colors"
        >
          <ApperIcon name="X" size={20} />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Task Title *" error={errors.title}>
          <Input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="What needs to be done?"
            className={errors.title ? 'border-error' : 'border-surface-300'}
          />
        </FormField>

        <FormField label="Description">
          <Input
            type="textarea"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Add more details..."
            rows={3}
            className="border-surface-300"
          />
        </FormField>

        <FormField label="Priority">
          <PrioritySelector
            selectedPriority={formData.priority}
            onSelectPriority={(p) => handleChange('priority', p)}
          />
        </FormField>

        <FormField label="Category">
          <Select
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full border-surface-300"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Due Date">
          <Input
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
            min={format(new Date(), 'yyyy-MM-dd')}
            className="border-surface-300"
          />
        </FormField>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCancel}
            className="flex-1 py-3 border border-surface-300 text-surface-700 rounded-lg hover:bg-surface-50 transition-all font-medium"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-3 bg-primary text-white rounded-lg hover:brightness-110 transition-all font-medium"
          >
            Add Task
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddTaskForm;