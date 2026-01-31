import Interest from '../models/Interest.js';
import Material from '../models/Material.js';

export const createInterest = async (req, res) => {
  const { materialId } = req.body;

  try {
    const material = await Material.findById(materialId);
    if (!material) return res.status(404).json({ message: 'Material not found' });

    // 1. CHECK IF CHAT ALREADY EXISTS
    const existing = await Interest.findOne({ 
      material_id: materialId, 
      buyer_id: req.user.id 
    });

    // --- CHANGE HERE: Return the existing chat instead of an error ---
    if (existing) {
      return res.status(200).json({ 
        message: 'Resuming chat', 
        interest: existing // Send the existing ID back
      });
    }

    // 2. CREATE NEW IF NOT EXISTS
    const interest = await Interest.create({
      material_id: materialId,
      buyer_id: req.user.id,
      seller_id: material.seller_id
    });

    res.status(201).json({ message: 'Chat started!', interest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyInterests = async (req, res) => {
  // ... (Keep the rest of the file exactly the same)
    try {
    const interests = await Interest.find({ buyer_id: req.user.id })
      .populate({
        path: 'material_id',
        populate: { path: 'seller_id', select: 'name' }
      })
      .sort({ created_at: -1 });

    res.json(interests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};