import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isPast } from 'date-fns';
import ApperIcon from './ApperIcon';
import TaskEditForm from './TaskEditForm';

const TaskCard = ({ task, onComplete, onDelete, onEdit, isArchived, onRestore }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const priorityColors = {
    high: 'bg-accent/10 text-accent border-accent/20',
    medium: 'bg-warning/10 text-warning border-warning/20',
    low: 'bg-success/10 text-success border-success/20'
  };

  const priorityDots = {
    high: 'bg-accent',
    medium: 'bg-warning',
    low: 'bg-success'
  };

  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !task.completed;
  const isDueToday = task.dueDate && isToday(new Date(task.dueDate));

  const handleEdit = (editedTask) => {
    onEdit(task.id, editedTask);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <TaskEditForm
        task={task}
        onSave={handleEdit}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.15 }}
      className={`bg-white rounded-xl p-4 shadow-sm border border-surface-100 hover:shadow-md transition-all relative ${
        task.completed ? 'opacity-75' : ''
      } ${isOverdue ? 'border-accent/30' : ''}`}
    >
      <div className="flex items-start gap-4">
        {/* Completion Checkbox */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onComplete(task.id)}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            task.completed
              ? 'bg-success border-success'
              : 'border-surface-300 hover:border-primary'
          }`}
          disabled={isArchived}
        >
          <AnimatePresence>
            {task.completed && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ApperIcon name="Check" className="text-white" size={14} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className={`font-medium text-surface-900 break-words ${
                task.completed ? 'line-through opacity-60' : ''
              }`}>
                {task.title}
              </h3>
              {task.description && (
                <p className={`text-sm text-surface-600 mt-1 break-words ${
                  task.completed ? 'line-through opacity-60' : ''
                }`}>
                  {task.description}
                </p>
              )}
            </div>

            {/* Actions Menu */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 text-surface-400 hover:text-surface-600 transition-colors"
              >
                <ApperIcon name="MoreHorizontal" size={16} />
              </motion.button>

              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-surface-200 py-1 z-30 min-w-[120px]"
                  >
                    {!isArchived && (
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setShowMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-surface-700 hover:bg-surface-50 flex items-center gap-2"
                      >
                        <ApperIcon name="Edit2" size={14} />
                        Edit
                      </button>
                    )}
                    {isArchived && onRestore && (
                      <button
                        onClick={() => {
                          onRestore(task.id);
                          setShowMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-surface-700 hover:bg-surface-50 flex items-center gap-2"
                      >
                        <ApperIcon name="RotateCcw" size={14} />
                        Restore
                      </button>
                    )}
                    <button
                      onClick={() => {
                        onDelete(task.id);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-error hover:bg-error/5 flex items-center gap-2"
                    >
                      <ApperIcon name="Trash2" size={14} />
                      Delete
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Task Meta */}
          <div className="flex items-center gap-3 mt-3">
            {/* Priority Badge */}
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${priorityColors[task.priority]}`}>
              <div className={`w-2 h-2 rounded-full ${priorityDots[task.priority]}`}></div>
              {task.priority}
            </div>

            {/* Category */}
            {task.category && (
              <div className="px-2 py-1 bg-surface-100 text-surface-600 rounded-full text-xs font-medium">
                {task.category}
              </div>
            )}

            {/* Due Date */}
            {task.dueDate && (
              <div className={`flex items-center gap-1 text-xs font-medium ${
                isOverdue 
                  ? 'text-accent' 
                  : isDueToday 
                    ? 'text-warning' 
                    : 'text-surface-500'
              }`}>
                <ApperIcon name="Calendar" size={12} />
                {format(new Date(task.dueDate), 'MMM d')}
                {isOverdue && <span className="text-accent font-semibold">Overdue</span>}
                {isDueToday && <span className="text-warning font-semibold">Today</span>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setShowMenu(false)}
        />
      )}
    </motion.div>
  );
};

export default TaskCard;