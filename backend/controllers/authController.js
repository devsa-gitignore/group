/*import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

router.post('/register', async (req, res) => {
  const { phone, name, role } = req.body;

  try {
    const userExists = await User.findOne({ phone });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ phone, name, role });

    if (user) {
      const token = generateToken(user._id, user.role);
      
      // SEND COOKIE
      res.cookie('jwt', token, {
        httpOnly: true, // Prevent client-side JS from reading it
        secure: process.env.NODE_ENV !== 'development', // HTTPS only in production
        sameSite: 'strict', // CSRF protection
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        role: user.role,
        message: 'Registered successfully'
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  const { phone } = req.body;

  try {
    const user = await User.findOne({ phone });

    if (user) {
      const token = generateToken(user._id, user.role);

      // SEND COOKIE
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.json({
        _id: user._id,
        name: user.name,
        role: user.role,
        message: 'Logged in successfully'
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0) // Expire immediately
  });
  res.status(200).json({ message: 'Logged out' });
});

// @route   GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
});

export default router;*/
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Helper: Generate Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Helper: Set Cookie
const setCookie = (res, token) => {
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

// @desc    Step 1: Check if user exists
// @route   POST /api/auth/check-user
export const checkUser = async (req, res) => {
  const { phone } = req.body;
  try {
    const user = await User.findOne({ phone });
    // Returns true if user exists, false if new
    res.json({ exists: !!user }); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Step 2a: Register New User
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  const { phone, otp, organization_name, role, location, coordinates } = req.body;

  // 1. Validate OTP (Mock)
  if (!otp || otp !== '1234') { 
    // Accept '1234' or any 4+ digit string for hackathon speed
    if (otp.length < 4) return res.status(400).json({ message: 'Invalid OTP' });
  }

  try {
    const userExists = await User.findOne({ phone });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // 2. Create User with Location Data
    // coordinates should be sent as [longitude, latitude] from frontend
    const user = await User.create({
      phone,
      name: organization_name, // Mapping org name to name
      role,
      location: {
        type: 'Point',
        coordinates: coordinates || [0, 0], // Default if user denies location permission
        address: location // The text string user entered
      }
    });

    const token = generateToken(user._id, user.role);
    setCookie(res, token);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      role: user.role,
      message: 'Registration successful',
      phone: user.phone,
      location: user.location,
      wallet_balance: user.wallet_balance,
      trust_score: user.trust_score,
      transaction_count: user.transaction_count,
      is_verified: user.is_verified,
      created_at: user.created_at //
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Step 2b: Login Existing User
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  const { phone, otp } = req.body;

  // Validate OTP
  if (!otp || otp.length < 4) return res.status(400).json({ message: 'Invalid OTP' });

  try {
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = generateToken(user._id, user.role);
    setCookie(res, token);

    res.json({
      _id: user._id,
      name: user.name,
      role: user.role,
      message: 'Login successful'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout
export const logoutUser = (req, res) => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: 'Logged out' });
};

// @desc    Get Current User
export const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
};