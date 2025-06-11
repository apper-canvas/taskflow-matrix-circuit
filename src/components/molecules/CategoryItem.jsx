import React from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const CategoryItem = ({ category, count, isSelected, onClick, isAllTasks = false }) => {
  return (
    <Button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
        isSelected
          ? 'bg-primary/10 text-primary border border-primary/20'
          : 'text-surface-700 hover:bg-surface-50'
      }`}
    >
      <div className="flex items-center gap-3">
        {isAllTasks ? (
          <ApperIcon name="List" size={18} />
        ) : (
          <div
            className="w-4 h-4 rounded-full flex-shrink-0"
            style={{ backgroundColor: category.color }}
          />
        )}
        <span className="font-medium break-words">{isAllTasks ? 'All Tasks' : category.name}</span>
      </div>
      <span className={`text-sm font-semibold px-2 py-1 rounded-full flex-shrink-0 ${
        isSelected
          ? 'bg-primary/20 text-primary'
          : 'bg-surface-200 text-surface-600'
      }`}>
        {count}
      </span>
    </Button>
  );
};

export default CategoryItem;