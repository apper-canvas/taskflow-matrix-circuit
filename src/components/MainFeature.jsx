import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from './TaskCard';
import ApperIcon from './ApperIcon';

const MainFeature = ({ tasks, onTaskComplete, onTaskDelete, onTaskEdit, searchQuery }) => {
  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-12"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <ApperIcon name="CheckSquare" className="w-16 h-16 text-surface-300 mx-auto" />
        </motion.div>
        <h3 className="mt-4 text-lg font-medium text-surface-900">
          {searchQuery ? 'No tasks found' : 'No tasks yet'}
        </h3>
        <p className="mt-2 text-surface-500">
          {searchQuery 
            ? `No tasks match "${searchQuery}"`
            : 'Create your first task to get started with TaskFlow'
          }
        </p>
        {!searchQuery && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:brightness-110 transition-all mx-auto"
          >
            <ApperIcon name="Plus" size={20} />
            Add Your First Task
          </motion.button>
        )}
      </motion.div>
    );
  }

  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="space-y-8">
      {/* Active Tasks */}
      {incompleteTasks.length > 0 && (
        <div>
          <h2 className="text-lg font-display font-semibold text-surface-900 mb-4">
            Active Tasks ({incompleteTasks.length})
          </h2>
          <div className="space-y-3">
            <AnimatePresence>
              {incompleteTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 300 }}
                  transition={{ 
                    delay: index * 0.05,
                    exit: { duration: 0.3 }
                  }}
                  layout
                >
                  <TaskCard
                    task={task}
                    onComplete={onTaskComplete}
                    onDelete={onTaskDelete}
                    onEdit={onTaskEdit}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div>
          <h2 className="text-lg font-display font-semibold text-surface-900 mb-4">
            Completed ({completedTasks.length})
          </h2>
          <div className="space-y-3">
            <AnimatePresence>
              {completedTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 300 }}
                  transition={{ 
                    delay: index * 0.05,
                    exit: { duration: 0.3 }
                  }}
                  layout
                >
                  <TaskCard
                    task={task}
                    onComplete={onTaskComplete}
                    onDelete={onTaskDelete}
                    onEdit={onTaskEdit}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainFeature;