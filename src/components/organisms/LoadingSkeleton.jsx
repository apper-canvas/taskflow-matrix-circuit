import React from 'react';
import { motion } from 'framer-motion';

const LoadingSkeleton = ({ type }) => {
  if (type === 'home') {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-shrink-0 p-6 bg-white border-b">
          <div className="animate-pulse">
            <div className="h-8 bg-surface-200 rounded w-48 mb-4"></div>
            <div className="h-4 bg-surface-200 rounded w-32"></div>
          </div>
        </div>
        <div className="flex-1 flex overflow-hidden">
          <div className="w-64 bg-white border-r p-6">
            <div className="animate-pulse space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 bg-surface-200 rounded"></div>
              ))}
            </div>
          </div>
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm"
                >
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                    <div className="h-3 bg-surface-200 rounded w-1/2"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'archive') {
    return (
      <div className="h-full p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-surface-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default LoadingSkeleton;