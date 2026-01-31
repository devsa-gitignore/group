import express from 'express';
import { createListing, getListings, getRecommendedPrice } from '../controllers/marketController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public: Browse with filters (e.g., /api/market/browse?location=mumbai&maxPrice=5000)
router.get('/browse', protect, getListings);

// Private: Get a price recommendation before listing
router.get('/recommend-price', protect, authorize('seller'), getRecommendedPrice);

// Private: Post a new item
router.post('/list', protect, authorize('seller'), createListing);

export default router;