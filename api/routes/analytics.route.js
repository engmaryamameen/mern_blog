import express from 'express';
import { 
  trackEvent, 
  getDashboardStats, 
  getPostAnalytics 
} from '../controllers/analytics.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

// Track analytics events (public)
router.post('/track', trackEvent);

// Get dashboard stats (admin only)
router.get('/dashboard', verifyUser, getDashboardStats);

// Get post-specific analytics (admin only)
router.get('/post/:postId', verifyUser, getPostAnalytics);

export default router; 