import React from 'react';

const Input = ({ type = 'text', value, onChange, placeholder, className, rows, min, ...props }) => {
  const commonClasses = `w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${className || ''}`;

  if (type === 'textarea') {
    return (
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`${commonClasses} resize-none`}
        {...props}
      />
    );
  }

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      min={min}
      className={commonClasses}
      {...props}
    />
  );
};

export default Input;