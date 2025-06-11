import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Checkbox = ({ checked, onClick, disabled, className = '' }) => {
  return (
    <Button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
        checked
          ? 'bg-success border-success'
          : 'border-surface-300 hover:border-primary'
      } ${className}`}
      disabled={disabled}
    >
      <AnimatePresence>
        {checked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <ApperIcon name="Check" className="text-white" size={14} />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
};

export default Checkbox;