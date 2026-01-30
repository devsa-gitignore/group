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


const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};


export const authenticateUser = async (req, res) => {
  const { phone, otp, name, role } = req.body;

  if (!otp || otp.length < 4) { 
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  try {
    let user = await User.findOne({ phone });

    if (user) {
    
      sendTokenResponse(user, 200, res);
    } else {

      if (!name || !role) {
        return res.status(400).json({ message: 'New user detected. Name and Role are required.' });
      }

      user = await User.create({
        phone,
        name,
        role,
      });

      sendTokenResponse(user, 201, res);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id, user.role);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, 
  };

  res.cookie('jwt', token, options).status(statusCode).json({
    _id: user._id,
    name: user.name,
    role: user.role,
    phone: user.phone,
    trust_score: user.trust_score,
    wallet: user.wallet_balance
  });
};

export const logoutUser = (req, res) => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: 'Logged out' });
};

export const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
};