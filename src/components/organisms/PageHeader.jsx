import React from 'react';
import { motion } from 'framer-motion';
import ProgressRing from '@/components/atoms/ProgressRing';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import SearchInputWithClear from '@/components/molecules/SearchInputWithClear';
import ApperIcon from '@/components/ApperIcon';

const PageHeader = ({ 
  title, 
  subtitle, 
  completedCount, 
  totalCount, 
  onAddTaskClick,
  searchQuery,
  onSearchChange,
  onClearSearch,
  sortBy,
  onSortChange
}) => {
  return (
    <div className="flex-shrink-0 p-6 bg-white border-b">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-surface-900">{title}</h1>
          {subtitle && (
            <p className="text-surface-600 font-body">
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          {totalCount !== undefined && completedCount !== undefined && (
            <ProgressRing completed={completedCount} total={totalCount} />
          )}
          {onAddTaskClick && (
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAddTaskClick}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:brightness-110 transition-all"
            >
              <ApperIcon name="Plus" size={20} />
              Add Task
            </Button>
          )}
        </div>
      </div>

      {(searchQuery !== undefined || onSortChange) && (
        <>
          {searchQuery !== undefined && (
            <SearchInputWithClear
              value={searchQuery}
              onChange={onSearchChange}
              onClear={onClearSearch}
              placeholder="Search tasks..."
              className="mb-4"
            />
          )}

          {onSortChange && (
            <div className="flex items-center gap-4">
              <Select
                value={sortBy}
                onChange={onSortChange}
                className="px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="priority">Sort by Priority</option>
                <option value="dueDate">Sort by Due Date</option>
                <option value="created">Sort by Created</option>
              </Select>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PageHeader;