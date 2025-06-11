import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full flex items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ApperIcon name="Search" className="w-20 h-20 text-surface-300 mx-auto mb-6" />
        </motion.div>
        
        <h1 className="text-6xl font-display font-bold text-surface-900 mb-4">404</h1>
        <h2 className="text-2xl font-display font-semibold text-surface-700 mb-4">Page not found</h2>
        <p className="text-surface-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="space-y-3">
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/tasks')}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:brightness-110 transition-all font-medium"
          >
            Go to Tasks
          </Button>
          
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="w-full px-6 py-3 border border-surface-300 text-surface-700 rounded-lg hover:bg-surface-50 transition-all font-medium"
          >
            Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;