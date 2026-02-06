require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/user.model');

async function seedAdmin() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in .env');
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@mindwise.com';
    const adminPassword = 'AdminPassword123!';

    // Remove existing to ensure fresh hash if model changed
    await User.deleteOne({ email: adminEmail });
    console.log('Removed existing admin user (if any)');

    const admin = new User({
      email: adminEmail,
      password: adminPassword,
      fullName: 'System Administrator',
      role: 'admin'
    });

    await admin.save();
    console.log('Admin user created successfully:');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error.message);
    process.exit(1);
  }
}

seedAdmin();
