import express from 'express';
import { 
  authenticateUser, 
  logoutUser, 
  getCurrentUser 
} from '../controllers/authController.js'; 
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/authenticate', authenticateUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getCurrentUser);
router.post('/list', protect, authorize('seller'), createListing);
router.get('/browse', protect, getAllListings);

export default router;