import express from 'express';
import { createInterest, getMyInterests } from '../controllers/interestController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', protect, createInterest);
router.get('/my', protect, getMyInterests);

export default router;