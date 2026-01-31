import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['seller', 'buyer'], required: true },
  
  location: {
    type: {
      type: String, 
      enum: ['Point'], 
      default: 'Point'
    },
    coordinates: {
      type: [Number], // Array of numbers [longitude, latitude]
      default: [0, 0]
    },
    address: { 
      type: String 
    }
  },

  trust_score: { type: Number, default: 50 },
  transaction_count: { type: Number, default: 0 }, // If 0, display "NEW" on frontend
  is_verified: { type: Boolean, default: false }, // For the "Verified Badge"
  wallet_balance: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', userSchema);