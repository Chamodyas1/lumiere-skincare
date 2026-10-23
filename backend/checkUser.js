const mongoose = require('mongoose');
const User = require('./models/User');

async function checkUser() {
  try {
    await mongoose.connect(
      'mongodb://127.0.0.1:27017/lumiere_skincare'
    );

    console.log('MongoDB connected');

    const user = await User.findOne({
      email: 'ඔයා_දැන්_REGISTER_කළ_EMAIL_එක'
    });

    if (!user) {
      console.log('❌ USER NOT FOUND');
    } else {
      console.log('✅ USER FOUND');
      console.log('Email:', user.email);
      console.log('Role:', user.role);
      console.log('Password hash exists:', !!user.password);
      console.log('Password:', user.password);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('ERROR:', error.message);
  }
}

checkUser();