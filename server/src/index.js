import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import ordersRouter from './routes/orders.js';
import dashboardRouter from './routes/dashboard.js';
import { seedOrders } from './utils/seedData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/orders', ordersRouter);
app.use('/api/dashboard', dashboardRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-dashboard';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✓ MongoDB connected successfully');
    console.log(`✓ Database: ${mongoose.connection.name}`);
    
    // Seed sample data if database is empty
    await seedOrders();
    
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('Check your MONGODB_URI in .env file');
    process.exit(1);
  });

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});
