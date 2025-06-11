import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from '@/components/organisms/TaskCard';
import NoContentMessage from '@/components/organisms/NoContentMessage';

const TaskList = ({ tasks, onTaskComplete, onTaskDelete, onTaskEdit, searchQuery, isArchivedList = false, onRestore, categories }) => {
  if (tasks.length === 0) {
    return (
      <NoContentMessage
        iconName={isArchivedList ? 'Archive' : 'CheckSquare'}
        title={searchQuery ? 'No tasks found' : isArchivedList ? 'No archived tasks' : 'No tasks yet'}
        description={
          searchQuery 
            ? `No tasks match "${searchQuery}"`
            : isArchivedList
              ? 'Completed tasks will appear here when archived'
              : 'Create your first task to get started with TaskFlow'
        }
        buttonText={!isArchivedList && !searchQuery ? 'Add Your First Task' : null}
        // onButtonClick handled by parent or passed down if needed for "Add Your First Task"
      />
    );
  }

  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="space-y-8">
      {/* Active Tasks */}
      {!isArchivedList && incompleteTasks.length > 0 && (
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
                    categories={categories}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {!isArchivedList && completedTasks.length > 0 && (
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
                    categories={categories}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Archived Tasks */}
      {isArchivedList && tasks.length > 0 && (
        <div className="space-y-4">
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <TaskCard
                task={task}
                onComplete={() => {}} // Not applicable for archived tasks
                onDelete={onTaskDelete}
                onEdit={() => {}} // Not applicable for archived tasks
                isArchived={true}
                onRestore={onRestore}
                categories={categories}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;