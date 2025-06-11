import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, className, onClick, type = 'button', disabled = false, ...props }) => {
  const isMotionButton = props.whileHover || props.whileTap || props.initial || props.animate || props.exit || props.transition || props.layout;

  const Component = isMotionButton ? motion.button : 'button';

  const filteredProps = { ...props };
  // Filter out any motion specific props if not using motion component
  if (!isMotionButton) {
    delete filteredProps.whileHover;
    delete filteredProps.whileTap;
    delete filteredProps.initial;
    delete filteredProps.animate;
    delete filteredProps.exit;
    delete filteredProps.transition;
    delete filteredProps.layout;
  }

  return (
    <Component
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
      {...filteredProps}
    >
      {children}
    </Component>
  );
};

export default Button;