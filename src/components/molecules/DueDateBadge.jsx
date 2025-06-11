import React from 'react';
import { format, isToday, isPast } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';

const DueDateBadge = ({ dueDate, completed }) => {
  if (!dueDate) return null;

  const date = new Date(dueDate);
  const overdue = isPast(date) && !completed;
  const dueToday = isToday(date);

  let className = 'text-surface-500';
  let statusText = '';

  if (overdue) {
    className = 'text-accent';
    statusText = 'Overdue';
  } else if (dueToday) {
    className = 'text-warning';
    statusText = 'Today';
  }

  return (
    <div className={`flex items-center gap-1 text-xs font-medium ${className}`}>
      <ApperIcon name="Calendar" size={12} />
      {format(date, 'MMM d')}
      {statusText && <span className={`font-semibold ${overdue ? 'text-accent' : 'text-warning'}`}>{statusText}</span>}
    </div>
  );
};

export default DueDateBadge;