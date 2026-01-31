import mongoose from 'mongoose';

const interestSchema = new mongoose.Schema({
  material_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Material', required: true },
  buyer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'accepted', 'rejected'] },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.models.Interest || mongoose.model('Interest', interestSchema);