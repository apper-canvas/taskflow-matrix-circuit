import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

const CategoryFilter = ({ categories, selectedCategory, onCategorySelect, tasks }) => {
  // Calculate task counts for each category
  const categoryStats = categories.map(category => ({
    ...category,
    count: tasks.filter(task => task.category === category.name && !task.completed).length
  }));

  const allTasksCount = tasks.filter(task => !task.completed).length;

  return (
    <div className="p-6">
      <h3 className="text-sm font-semibold text-surface-700 uppercase tracking-wide mb-4">
        Categories
      </h3>
      
      <div className="space-y-2">
        {/* All Tasks */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onCategorySelect('all')}
          className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
            selectedCategory === 'all'
              ? 'bg-primary/10 text-primary border border-primary/20'
              : 'text-surface-700 hover:bg-surface-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <ApperIcon name="List" size={18} />
            <span className="font-medium">All Tasks</span>
          </div>
          <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
            selectedCategory === 'all'
              ? 'bg-primary/20 text-primary'
              : 'bg-surface-200 text-surface-600'
          }`}>
            {allTasksCount}
          </span>
        </motion.button>

        {/* Category Filters */}
        {categoryStats.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onCategorySelect(category.name)}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
              selectedCategory === category.name
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-surface-700 hover:bg-surface-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: category.color }}
              />
              <span className="font-medium break-words">{category.name}</span>
            </div>
            <span className={`text-sm font-semibold px-2 py-1 rounded-full flex-shrink-0 ${
              selectedCategory === category.name
                ? 'bg-primary/20 text-primary'
                : 'bg-surface-200 text-surface-600'
            }`}>
              {category.count}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-8 p-4 bg-surface-50 rounded-lg">
        <h4 className="text-sm font-semibold text-surface-700 mb-3">Today's Progress</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-surface-600">Completed</span>
            <span className="font-semibold text-success">
              {tasks.filter(t => t.completed).length}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-surface-600">Remaining</span>
            <span className="font-semibold text-surface-900">
              {tasks.filter(t => !t.completed).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;