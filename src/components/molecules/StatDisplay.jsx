import React from 'react';

const StatDisplay = ({ label, value, valueClassName = '' }) => {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-surface-600">{label}</span>
      <span className={`font-semibold ${valueClassName}`}>{value}</span>
    </div>
  );
};

export default StatDisplay;