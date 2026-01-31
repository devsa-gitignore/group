import express from 'express';
import { 
  getChat, 
  sendMessage, 
  updateMessageStatus 
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all messages for a specific interest/deal
router.get('/:interestId', protect, getChat);

// Send a message (Text or Deal Proposal)
router.post('/:interestId/send', protect, sendMessage);

// Update status of a deal message (Accept/Decline)
router.put('/:interestId/message/:msgId', protect, updateMessageStatus);

export default router;