import express from 'express';
import { 
  checkUser, 
  registerUser, 
  loginUser, 
  logoutUser, 
  getCurrentUser 
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Check if phone exists (Step 1 of your UI)
router.post('/check-user', checkUser);

// 2. Register a NEW user (Step 2 - if user didn't exist)
router.post('/register', registerUser);

// 3. Login an EXISTING user (Step 2 - if user existed)
router.post('/login', loginUser);

// Standard utility routes
router.post('/logout', logoutUser);
router.get('/me', protect, getCurrentUser);

export default router;