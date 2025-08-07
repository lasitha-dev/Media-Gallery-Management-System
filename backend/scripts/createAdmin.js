import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully');

    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      console.error('Error: ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env file');
      return;
    }

    // Check if user with this email exists
    const existingUser = await User.findOne({ email: process.env.ADMIN_EMAIL });
    
    let adminUser;
    if (existingUser) {
      // Update existing user to admin if needed
      if (existingUser.role !== 'admin') {
        existingUser.role = 'admin';
        existingUser.name = process.env.ADMIN_NAME || 'Admin User';
        existingUser.password = process.env.ADMIN_PASSWORD;
        existingUser.verified = true;
        adminUser = await existingUser.save();
        console.log('Existing user updated to admin role:', {
          id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email
        });
      } else {
        console.log('User already exists as admin:', {
          id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email
        });
      }
      return;
    }

    // Create new admin user
    adminUser = await User.create({
      name: process.env.ADMIN_NAME || 'Admin User',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'admin',
      verified: true // Admin is automatically verified
    });

    console.log('Admin user created successfully:', {
      id: adminUser._id,
      name: adminUser.name,
      email: adminUser.email
    });

  } catch (error) {
    console.error('Error creating admin user:', error.message);
    if (error.message.includes('MONGODB_URI')) {
      console.log('\nMake sure your .env file has the MONGODB_URI variable set correctly');
    }
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    process.exit();
  }
};

// Handle script errors
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection:', error);
  mongoose.connection.close();
  process.exit(1);
});

// Run the script
createAdmin();
