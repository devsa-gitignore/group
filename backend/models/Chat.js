import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['text', 'deal'], default: 'text' },
  
  // If type === 'text'
  text: String,
  
  // If type === 'deal'
  price: Number,
  deal_status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  
  timestamp: { type: Date, default: Date.now }
});

const chatSchema = new mongoose.Schema({
  interest_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Interest', required: true, unique: true },
  messages: [messageSchema]
});

export default mongoose.models.Chat || mongoose.model('Chat', chatSchema);