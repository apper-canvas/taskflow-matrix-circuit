import React from 'react';

const PriorityBadge = ({ priority }) => {
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

  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${priorityColors[priority]}`}>
      <div className={`w-2 h-2 rounded-full ${priorityDots[priority]}`}></div>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </div>
  );
};

export default PriorityBadge;