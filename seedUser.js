require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/user.model');

async function seedUser() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in .env');
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const userEmail = 'user@example.com';
    const userPassword = 'UserPassword123!';

    // Remove existing to ensure fresh hash
    await User.deleteOne({ email: userEmail });
    console.log('Removed existing test user (if any)');

    const user = new User({
      email: userEmail,
      password: userPassword,
      fullName: 'Test User',
      role: 'user' // Normal user role
    });

    await user.save();
    console.log('Normal user account created successfully:');
    console.log(`Email: ${userEmail}`);
    console.log(`Password: ${userPassword}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding user account:', error.message);
    process.exit(1);
  }
}

seedUser();
