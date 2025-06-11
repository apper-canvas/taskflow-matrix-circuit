import { motion } from 'framer-motion';

const ProgressRing = ({ completed, total }) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-12 h-12">
      <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
        {/* Background circle */}
        <circle
          cx="24"
          cy="24"
          r={radius}
          stroke="#e2e8f0"
          strokeWidth="4"
          fill="none"
        />
        {/* Progress circle */}
        <motion.circle
          cx="24"
          cy="24"
          r={radius}
          stroke="#5B47E0"
          strokeWidth="4"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>
      
      {/* Percentage text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold text-surface-700">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
};

export default ProgressRing;