import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  material_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Material' },
  buyer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  agreed_price: Number,
  total_amount: Number,
  status: { type: String, default: 'confirmed' }, // confirmed, picked_up, in_transit, delivered
  history: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    hash: String,
    prevHash: String
  }],
  created_at: { type: Date, default: Date.now }
});

export default mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);