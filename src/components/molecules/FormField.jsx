import React from 'react';

const FormField = ({ label, id, children, error, className = '' }) => {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-surface-700 mb-2">
          {label}
        </label>
      )}
      {children}
      {error && (
        <p className="text-error text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormField;