import React from 'react';

const Select = ({ value, onChange, children, className, ...props }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${className || ''}`}
      {...props}
    >
      {children}
    </select>
  );
};

export default Select;