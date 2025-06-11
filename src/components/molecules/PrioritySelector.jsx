import React from 'react';
import Button from '@/components/atoms/Button';

const PrioritySelector = ({ selectedPriority, onSelectPriority }) => {
  const priorityMap = {
    high: { className: 'bg-accent/10 border-accent text-accent' },
    medium: { className: 'bg-warning/10 border-warning text-warning' },
    low: { className: 'bg-success/10 border-success text-success' }
  };

  return (
    <div className="flex gap-2">
      {['high', 'medium', 'low'].map((priority) => (
        <Button
          key={priority}
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectPriority(priority)}
          className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
            selectedPriority === priority
              ? priorityMap[priority].className
              : 'border-surface-300 text-surface-600 hover:border-surface-400'
          }`}
        >
          {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </Button>
      ))}
    </div>
  );
};

export default PrioritySelector;