import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    phone: { type: String, required: true, unique: true },
    name: String,
    role: { type: String, enum: ['seller', 'buyer'] },
    trust_score: { type: Number, default: 50 },
    wallet: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});
