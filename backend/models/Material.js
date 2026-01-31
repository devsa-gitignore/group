/*import mongoose from 'mongoose';
const materialSchema = new mongoose.Schema({
    seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: String, // 'Plastic', 'Cotton'
    qty: Number,
    price: Number,
    status: { type: String, default: 'available' }
});*/
import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
  seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true }, 
  quantity: { type: Number, required: true }, 
  
  total_price: { type: Number, required: true }, // Seller's Price
  market_price_at_listing: { type: Number }, // To show the "Market Avg" mention
  
  description: String,
  location: { type: String, required: true },
  images: [String], // Array of Image URLs
  
  status: { type: String, default: 'available', enum: ['available', 'reserved', 'sold'] },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.models.Material || mongoose.model('Material', materialSchema);