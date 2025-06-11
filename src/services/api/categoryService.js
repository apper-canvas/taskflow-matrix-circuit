import { delay } from '../index';
import categoriesData from '../mockData/categories.json';

// In-memory storage simulation
let categories = [...categoriesData];

const categoryService = {
  async getAll() {
    await delay(200);
    return [...categories];
  },

  async getById(id) {
    await delay(150);
    const category = categories.find(c => c.id === id);
    if (!category) {
      throw new Error('Category not found');
    }
    return { ...category };
  },

  async create(categoryData) {
    await delay(300);
    const newCategory = {
      id: Date.now().toString(),
      ...categoryData,
      taskCount: 0
    };
    categories.push(newCategory);
    return { ...newCategory };
  },

  async update(id, updateData) {
    await delay(250);
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Category not found');
    }
    
    categories[index] = { ...categories[index], ...updateData };
    return { ...categories[index] };
  },

  async delete(id) {
    await delay(200);
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Category not found');
    }
    
    const deletedCategory = categories[index];
    categories.splice(index, 1);
    return { ...deletedCategory };
  }
};

export { categoryService };