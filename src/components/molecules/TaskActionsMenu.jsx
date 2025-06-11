import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const TaskActionsMenu = ({ onEdit, onDelete, onRestore, isArchived }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleAction = (action) => {
    action();
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <Button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowMenu(!showMenu)}
        className="p-1 text-surface-400 hover:text-surface-600 transition-colors"
      >
        <ApperIcon name="MoreHorizontal" size={16} />
      </Button>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-surface-200 py-1 z-30 min-w-[120px]"
          >
            {!isArchived && onEdit && (
              <Button
                onClick={() => handleAction(onEdit)}
                className="w-full text-left px-3 py-2 text-sm text-surface-700 hover:bg-surface-50 flex items-center gap-2"
              >
                <ApperIcon name="Edit2" size={14} />
                Edit
              </Button>
            )}
            {isArchived && onRestore && (
              <Button
                onClick={() => handleAction(onRestore)}
                className="w-full text-left px-3 py-2 text-sm text-surface-700 hover:bg-surface-50 flex items-center gap-2"
              >
                <ApperIcon name="RotateCcw" size={14} />
                Restore
              </Button>
            )}
            {onDelete && (
              <Button
                onClick={() => handleAction(onDelete)}
                className="w-full text-left px-3 py-2 text-sm text-error hover:bg-error/5 flex items-center gap-2"
              >
                <ApperIcon name="Trash2" size={14} />
                Delete
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {showMenu && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default TaskActionsMenu;