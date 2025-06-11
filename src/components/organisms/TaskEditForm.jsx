import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import FormField from '@/components/molecules/FormField';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';

const TaskEditForm = ({ task, onSave, onCancel, categories = [] }) => {
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description || '',
    priority: task.priority,
    category: task.category,
    dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : ''
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

    const updatedData = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      dueDate: formData.dueDate ? new Date(formData.dueDate) : null
    };

    onSave(updatedData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl p-4 shadow-sm border border-surface-200"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField error={errors.title}>
          <Input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Task title"
            className={errors.title ? 'border-error' : 'border-surface-300'}
          />
        </FormField>

        <FormField>
          <Input
            type="textarea"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Description"
            rows={2}
            className="border-surface-300"
          />
        </FormField>

        <div className="flex gap-3">
          <div className="flex-1">
            <Select
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
              className="w-full border-surface-300"
            >
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </Select>
          </div>
          <div className="flex-1">
            <Input
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              className="w-full border-surface-300"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            className="px-3 py-1 text-sm text-surface-600 hover:text-surface-800 transition-colors"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-1 bg-primary text-white text-sm rounded-lg hover:brightness-110 transition-all"
          >
            Save
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default TaskEditForm;