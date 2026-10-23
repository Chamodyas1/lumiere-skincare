
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const productQuestionsRoutes = require('./routes/productQuestions');

// Load environment variables
dotenv.config();

const app = express();

// ==================== MIDDLEWARE ====================
app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/product-questions', productQuestionsRoutes);

console.log('🚀 Lumière Skincare Backend Starting...');
console.log('📅', new Date().toLocaleString());

// ==================== MONGODB CONNECTION ====================
const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb://127.0.0.1:27017/lumiere_skincare';

console.log('📦 Connecting to MongoDB...');

let isConnected = false;

const connectDB = async () => {
  try {
    if (isConnected) {
      console.log('✅ MongoDB already connected');
      return;
    }

    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
    });

    isConnected = true;

    console.log('✅ MongoDB connected successfully');
    console.log(`📚 Database: ${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
      isConnected = false;
      setTimeout(connectDB, 5000);
    });

  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);

    console.log('💡 Make sure MongoDB is running.');
    console.log('🔄 Retrying connection in 10 seconds...');

    setTimeout(connectDB, 10000);
  }
};

// Initial connection
connectDB();

// ==================== TEST ROUTE ====================
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Lumière API is running! ✨',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    mongodb: isConnected ? 'connected' : 'disconnected',

    endpoints: {
      products: '/api/products',
      users: '/api/users',
      orders: '/api/orders',
      cart: '/api/cart',
      admin: '/api/admin',
      ai: '/api/ai/chat',
    },
  });
});

// ==================== HEALTH CHECK ====================
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    mongodb: isConnected ? 'connected' : 'disconnected',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ==================== ROUTES ====================
console.log('📡 Loading routes...');

// Products
try {
  app.use('/api/products', require('./routes/products'));
  console.log('  ✅ /api/products loaded');
} catch (err) {
  console.error('  ❌ Error loading /api/products:', err.message);
}

// Users
try {
  app.use('/api/users', require('./routes/users'));
  console.log('  ✅ /api/users loaded');
} catch (err) {
  console.error('  ❌ Error loading /api/users:', err.message);
}

// Orders
try {
  app.use('/api/orders', require('./routes/orders'));
  console.log('  ✅ /api/orders loaded');
} catch (err) {
  console.error('  ❌ Error loading /api/orders:', err.message);
}

// Cart
try {
  app.use('/api/cart', require('./routes/cart'));
  console.log('  ✅ /api/cart loaded');
} catch (err) {
  console.error('  ❌ Error loading /api/cart:', err.message);
}

// Admin
try {
  app.use('/api/admin', require('./routes/admin'));
  console.log('  ✅ /api/admin loaded');
} catch (err) {
  console.error('  ❌ Error loading /api/admin:', err.message);
}

// AI SKINCARE CHATBOT
try {
  app.use('/api/ai', require('./routes/ai'));
  console.log('  ✅ /api/ai loaded');
} catch (err) {
  console.error('  ❌ Error loading /api/ai:', err.message);
}

// ==================== 404 HANDLER ====================
app.use((req, res) => {
  console.warn(`⚠️ 404: ${req.method} ${req.url}`);

  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.url,
  });
});

// ==================== GLOBAL ERROR HANDLER ====================
app.use((err, req, res, next) => {
  console.error('❌ Unhandled Error:', err.stack);

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(
      (e) => e.message
    );

    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors,
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0];

    return res.status(400).json({
      success: false,
      message: `Duplicate value for ${field || 'field'}`,
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong!',
  });
});

// ==================== SERVER START ====================
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);

  console.log('📡 API Endpoints:');
  console.log('   - GET  /                  - API Status');
  console.log('   - GET  /health            - Health Check');
  console.log('   - GET  /api/products      - Products');
  console.log('   - POST /api/users/login   - Login');
  console.log('   - POST /api/users/register - Register');
  console.log('   - GET  /api/admin/stats   - Admin Dashboard');
  console.log('   - POST /api/ai/chat       - AI Skincare Chatbot');

  console.log(
    `\n📊 MongoDB Status: ${
      isConnected ? '🟢 Connected' : '🔴 Disconnected'
    }`
  );

  console.log('\n✨ Lumière Skincare API is ready!');
});

// ==================== GRACEFUL SHUTDOWN ====================
let shuttingDown = false;
const gracefulShutdown = () => {
  if (shuttingDown) return;
  shuttingDown = true;

  console.log('\n🛑 Received shutdown signal');

  server.close(() => {
    console.log('📡 Server closed');

    mongoose.connection.close(false)
      .then(() => {
        console.log('📚 MongoDB connection closed');
        console.log('👋 Goodbye!');
        process.exit(0);
      })
      .catch((err) => {
        console.error('MongoDB shutdown error:', err.message);
        process.exit(1);
      });
  });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

process.on('unhandledRejection', (reason) => {
  console.error('💥 Unhandled Rejection:', reason);
});

console.log('✅ Server setup complete');
