import mongoose from 'mongoose';
const materialSchema = new mongoose.Schema({
    seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: String, // 'Plastic', 'Cotton'
    qty: Number,
    price: Number,
    status: { type: String, default: 'available' }
});