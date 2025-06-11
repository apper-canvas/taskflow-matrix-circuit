import { taskService } from './api/taskService';
import { categoryService } from './api/categoryService';

// Utility function for delays
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export {
  taskService,
  categoryService
};