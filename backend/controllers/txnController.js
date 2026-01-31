import Transaction from '../models/Transaction.js';
import Interest from '../models/Interest.js';
import Material from '../models/Material.js';
import crypto from 'crypto';

// Helper: Generate SHA-256 Hash
const generateHash = (data) => {
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
};

// @desc    Create a new Transaction (After Payment)
// @route   POST /api/transactions/create
export const createTransaction = async (req, res) => {
  const { interest_id, agreed_price, payment_method } = req.body;

  try {
    // 1. Get Interest details to link Buyer/Seller/Material
    const interest = await Interest.findById(interest_id).populate('material_id');
    if (!interest) return res.status(404).json({ message: 'Interest/Deal not found' });

    // 2. Create the Genesis Hash (First block in chain)
    const genesisData = {
      status: 'confirmed',
      timestamp: new Date(),
      prevHash: '0' // Genesis block has no previous hash
    };
    const genesisHash = generateHash(genesisData);

    // 3. Create Transaction Record
    const transaction = await Transaction.create({
      material_id: interest.material_id._id,
      buyer_id: req.user.id,
      seller_id: interest.seller_id,
      agreed_price,
      total_amount: agreed_price, // simplified
      status: 'confirmed',
      history: [{
        status: 'confirmed',
        timestamp: genesisData.timestamp,
        hash: genesisHash,
        prevHash: '0'
      }]
    });
    await Material.findByIdAndUpdate(interest.material_id._id, { 
      status: 'sold' 
    });
    await Interest.findByIdAndUpdate(interest_id, { status: 'accepted' });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Transaction Details (Tracking Page)
// @route   GET /api/transactions/:id
export const getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('material_id')
      .populate('seller_id', 'name phone')
      .populate('buyer_id', 'name phone');

    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Status (e.g., Picked Up -> Delivered)
// @route   PUT /api/transactions/:id/status
export const updateTransactionStatus = async (req, res) => {
  const { status } = req.body; // 'picked_up', 'in_transit', 'delivered'
  
  try {
    const txn = await Transaction.findById(req.params.id);
    if (!txn) return res.status(404).json({ message: 'Transaction not found' });

    // 1. Get Previous Hash to link the chain
    const lastEntry = txn.history[txn.history.length - 1];
    
    // 2. Generate New Hash
    const newData = {
      status,
      timestamp: new Date(),
      prevHash: lastEntry.hash 
    };
    const newHash = generateHash(newData);

    // 3. Push to History
    txn.history.push({
      status,
      timestamp: newData.timestamp,
      hash: newHash,
      prevHash: lastEntry.hash
    });
    
    txn.status = status;
    await txn.save();

    res.json(txn);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};