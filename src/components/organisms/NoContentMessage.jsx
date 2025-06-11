import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const NoContentMessage = ({ iconName, title, description, buttonText, onButtonClick }) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center py-12"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        <ApperIcon name={iconName} className="w-16 h-16 text-surface-300 mx-auto" />
      </motion.div>
      <h3 className="mt-4 text-lg font-medium text-surface-900">{title}</h3>
      <p className="mt-2 text-surface-500">{description}</p>
      {buttonText && (
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onButtonClick}
          className="mt-6 flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:brightness-110 transition-all mx-auto"
        >
          <ApperIcon name="Plus" size={20} />
          {buttonText}
        </Button>
      )}
    </motion.div>
  );
};

export default NoContentMessage;