import express from 'express';
import { 
  createTransaction, 
  getTransaction, 
  updateTransactionStatus 
} from '../controllers/txnController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create txn (After Buyer pays)
router.post('/create', protect, createTransaction);

// Get txn details (For Tracking Page)
router.get('/:id', protect, getTransaction);

// Update status (Seller marks picked up, etc.)
router.put('/:id/status', protect, updateTransactionStatus);

// THIS IS THE LINE THAT FIXES YOUR ERROR:
export default router;