import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Checkbox from '@/components/atoms/Checkbox';
import TaskEditForm from '@/components/organisms/TaskEditForm';
import TaskActionsMenu from '@/components/molecules/TaskActionsMenu';
import PriorityBadge from '@/components/molecules/PriorityBadge';
import DueDateBadge from '@/components/molecules/DueDateBadge';

const TaskCard = ({ task, onComplete, onDelete, onEdit, isArchived = false, onRestore, categories }) => {
  const [isEditing, setIsEditing] = useState(false);

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
        categories={categories} // Pass categories to edit form
      />
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.15 }}
      className={`bg-white rounded-xl p-4 shadow-sm border border-surface-100 hover:shadow-md transition-all relative ${
        task.completed ? 'opacity-75' : ''
      } ${task.dueDate && new Date(task.dueDate) &lt; new Date() && !task.completed ? 'border-accent/30' : ''}`}
    >
      <div className="flex items-start gap-4">
        <Checkbox
          checked={task.completed}
          onClick={() => onComplete(task.id)}
          disabled={isArchived}
        />

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

            <TaskActionsMenu
              onEdit={isArchived ? null : () => setIsEditing(true)}
              onDelete={() => onDelete(task.id)}
              onRestore={isArchived ? () => onRestore(task.id) : null}
              isArchived={isArchived}
            />
          </div>

          <div className="flex items-center gap-3 mt-3">
            <PriorityBadge priority={task.priority} />

            {task.category && (
              <div className="px-2 py-1 bg-surface-100 text-surface-600 rounded-full text-xs font-medium">
                {task.category}
              </div>
            )}

            <DueDateBadge dueDate={task.dueDate} completed={task.completed} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;