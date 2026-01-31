import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import path from 'path'; 
import { fileURLToPath } from 'url';

// --- Import Routes ---
import authRoutes from './routes/authRoutes.js';
import marketRoutes from './routes/marketRoutes.js';
import interestRoutes from './routes/interestRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import txnRoutes from './routes/txnRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Middleware ---
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true 
}));

// --- Mount Routes (MUST BE BEFORE app.listen) ---
app.use('/api/auth', authRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/interests', interestRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/transactions', txnRoutes);
app.use('/api/upload', uploadRoutes);

// --- Root Route ---
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.get('/', (req, res) => {
  res.send('API is running...');
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});