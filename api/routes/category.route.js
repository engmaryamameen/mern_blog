import express from 'express';
import { 
  createCategory,
  getCategories,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
  getCategoryHierarchy,
  getCategoryStats
} from '../controllers/category.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/hierarchy', getCategoryHierarchy);
router.get('/:slug', getCategoryBySlug);

// Admin routes
router.post('/', verifyUser, createCategory);
router.put('/:id', verifyUser, updateCategory);
router.delete('/:id', verifyUser, deleteCategory);
router.get('/stats/overview', verifyUser, getCategoryStats);

export default router; 