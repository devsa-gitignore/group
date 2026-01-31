import Material from '../models/material.js';

// --- HELPER FUNCTIONS ---

// Helper: Calculate average price per kg for a specific material type
// This is used internally for createListing and externally for getRecommendedPrice
const calculateMarketMetrics = async (type) => {
  // Case-insensitive search for previous items of this type
  const previousItems = await Material.find({ 
    type: { $regex: type, $options: 'i' },
    status: { $ne: 'available' } // Optional: Only calculate based on SOLD items? For now, we use all.
  });

  if (previousItems.length === 0) {
    return { avgPricePerKg: 0, count: 0 };
  }
  
  // Logic: Sum of (Total Price / Quantity) for each item
  const totalUnitPrices = previousItems.reduce((acc, item) => {
    // Avoid division by zero
    if (item.quantity <= 0) return acc; 
    return acc + (item.total_price / item.quantity);
  }, 0);

  const avgPricePerKg = totalUnitPrices / previousItems.length;
  return { 
    avgPricePerKg: parseFloat(avgPricePerKg.toFixed(2)), 
    count: previousItems.length 
  };
};


// --- CONTROLLERS ---

// @desc    Get a price recommendation before listing
// @route   GET /api/market/recommend-price
export const getRecommendedPrice = async (req, res) => {
  const { type, quantity } = req.query;

  if (!type || !quantity) {
    return res.status(400).json({ message: "Type and Quantity are required" });
  }

  try {
    const { avgPricePerKg, count } = await calculateMarketMetrics(type);

    if (count === 0) {
      return res.json({ 
        recommendation: 0, 
        message: "No history found. You are setting the market price!" 
      });
    }

    // Recommendation = Avg Price Per Kg * User's Quantity
    const recommendedTotal = (avgPricePerKg * Number(quantity)).toFixed(2);

    res.json({ 
      recommended_total: Number(recommendedTotal),
      avg_market_rate: avgPricePerKg,
      based_on_listings: count 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Create a new material listing
// @route   POST /api/market/list
export const createListing = async (req, res) => {
  try {
    const { type, quantity, total_price, description, location, images } = req.body;
    
    // 1. Auto-calculate the market price context
    // This allows us to show "Listed at ₹200 (Market Avg: ₹210)" later
    const { avgPricePerKg } = await calculateMarketMetrics(type);
    const marketTotal = avgPricePerKg > 0 ? (avgPricePerKg * quantity) : 0;

    // 2. Create the listing
    const listing = await Material.create({ 
      seller_id: req.user.id,
      type,
      quantity,
      total_price,
      description,
      location,
      images: images || [], // Store array of image URLs
      market_price_at_listing: marketTotal // Snapshot of market value at this moment
    });

    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Get all listings with Filters & Dynamic Badges
// @route   GET /api/market/browse
export const getListings = async (req, res) => {
  const { location, material, maxPrice } = req.query;
  
  // Build Query Object
  let query = { status: 'available' };

  if (material) {
    query.type = { $regex: material, $options: 'i' }; // Partial match, case insensitive
  }

  if (location) {
    query.location = { $regex: location, $options: 'i' };
  }

  if (maxPrice) {
    query.total_price = { $lte: Number(maxPrice) };
  }

  try {
    // Fetch and Populate Seller Info
    // We need 'transaction_count' to decide if they are "New"
    const listings = await Material.find(query)
      .populate('seller_id', 'name trust_score transaction_count is_verified')
      .sort({ created_at: -1 }) // Newest first
      .lean(); // Convert Mongoose Docs to plain JS objects so we can add custom properties

    // Add Dynamic Badge Logic
    const enhancedListings = listings.map(item => {
      // Handle edge case where seller might be null (deleted user)
      if (!item.seller_id) return item;

      const seller = item.seller_id;
      let badge = null;

      // Logic: Show "New Seller" if 0 transactions
      if (seller.transaction_count === 0) {
        badge = "New Seller"; 
      } else {
        // Logic: Show Trust Badge based on Score
        if (seller.trust_score >= 80) badge = "Gold";
        else if (seller.trust_score >= 60) badge = "Silver";
        else badge = "Bronze";
      }

      return {
        ...item,
        seller_badge: badge, // Frontend will render this text/icon
        seller_verified: seller.is_verified, // Frontend will show a blue tick if true
        
        // Helper for frontend "Deal Rating" (e.g., "Good Price!")
        // Compare listing price vs market average at time of listing
        is_good_deal: item.market_price_at_listing > 0 && item.total_price < item.market_price_at_listing
      };
    });

    res.json(enhancedListings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};