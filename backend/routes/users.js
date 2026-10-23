const express = require('express');
const router = express.Router();
const User = require('../models/User');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );
};

// ===============================
// REGISTER
// ===============================
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log('================================');
    console.log('REGISTER REQUEST');
    console.log('REGISTER DB:', mongoose.connection.name);
    console.log('REGISTER EMAIL:', email);
    console.log('================================');

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      role: 'user',
      isActive: true,
    });

    await user.save();

    console.log('✅ USER SAVED');
    console.log('USER ID:', user._id);
    console.log('USER EMAIL:', user.email);
    console.log('USER ROLE:', user.role);

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });

  } catch (error) {
    console.error('REGISTER ERROR:', error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// ===============================
// LOGIN
// ===============================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('================================');
    console.log('LOGIN REQUEST');
    console.log('LOGIN DB:', mongoose.connection.name);
    console.log('LOGIN EMAIL:', email);
    console.log('================================');

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      console.log('❌ LOGIN USER NOT FOUND');
      
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    console.log('✅ LOGIN USER FOUND');
    console.log('USER ID:', user._id);
    console.log('USER EMAIL:', user.email);
    console.log('USER ROLE:', user.role);

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated',
      });
    }

    const isMatch = await user.comparePassword(password);

    console.log('PASSWORD MATCH:', isMatch);

    if (!isMatch) {
      console.log('❌ PASSWORD DOES NOT MATCH');

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);

    console.log('✅ LOGIN SUCCESS');
    console.log('User:', user.email);
    console.log('Role:', user.role);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });

  } catch (error) {
    console.error('LOGIN ERROR:', error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// ===============================
// PROFILE
// ===============================
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      user,
    });

  } catch (error) {
    console.error('PROFILE ERROR:', error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


module.exports = router;