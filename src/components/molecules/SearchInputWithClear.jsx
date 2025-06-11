import React from 'react';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const SearchInputWithClear = ({ value, onChange, onClear, placeholder = 'Search...', className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" size={20} />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-3 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
      />
      {value && (
        <Button
          onClick={onClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-400 hover:text-surface-600"
        >
          <ApperIcon name="X" size={16} />
        </Button>
      )}
    </div>
  );
};

export default SearchInputWithClear;