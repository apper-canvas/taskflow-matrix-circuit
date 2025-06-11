import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ErrorMessage = ({ message, onReloadClick }) => {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
        <h3 className="text-lg font-medium text-surface-900 mb-2">Something went wrong</h3>
        <p className="text-surface-600 mb-4">{message}</p>
        <Button
          onClick={onReloadClick}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:brightness-110 transition-all"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
};

export default ErrorMessage;