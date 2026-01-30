import mongoose from 'mongoose';
const transactionSchema = new mongoose.Schema({
    material_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Material' },
    buyer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, default: 'negotiating' },
    history: [{
        action: String,
        hash: String, // SHA-256
        timestamp: { type: Date, default: Date.now }
    }]
});