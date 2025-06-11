import React from 'react';
import CategoryItem from '@/components/molecules/CategoryItem';
import StatDisplay from '@/components/molecules/StatDisplay';

const CategorySidebar = ({ categories, selectedCategory, onCategorySelect, tasks }) => {
  const categoryStats = categories.map(category => ({
    ...category,
    count: tasks.filter(task => task.category === category.name && !task.completed).length
  }));

  const allTasksCount = tasks.filter(task => !task.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;
  const remainingCount = tasks.filter(t => !t.completed).length;

  return (
    <div className="p-6">
      <h3 className="text-sm font-semibold text-surface-700 uppercase tracking-wide mb-4">
        Categories
      </h3>
      
      <div className="space-y-2">
        <CategoryItem
          isAllTasks
          isSelected={selectedCategory === 'all'}
          onClick={() => onCategorySelect('all')}
          count={allTasksCount}
        />

        {categoryStats.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            count={category.count}
            isSelected={selectedCategory === category.name}
            onClick={() => onCategorySelect(category.name)}
          />
        ))}
      </div>

      <div className="mt-8 p-4 bg-surface-50 rounded-lg">
        <h4 className="text-sm font-semibold text-surface-700 mb-3">Today's Progress</h4>
        <div className="space-y-2">
          <StatDisplay label="Completed" value={completedCount} valueClassName="text-success" />
          <StatDisplay label="Remaining" value={remainingCount} valueClassName="text-surface-900" />
        </div>
      </div>
    </div>
  );
};

export default CategorySidebar;