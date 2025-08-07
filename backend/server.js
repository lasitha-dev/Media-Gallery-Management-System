import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

// Load environment variables first
dotenv.config();

// Import routes and utilities
import authRoutes from './routes/authRoutes.js';
import { transporter } from './utils/otp.js';

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/auth/google/callback",
    proxy: true
  },
  function(accessToken, refreshToken, profile, done) {
    done(null, profile);
  }
));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Routes
app.use('/api/auth', authRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Media Gallery API' });
});

// Verify email configuration
const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log('Email configuration is valid');
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    console.log('Email Settings:', {
      user: process.env.GMAIL_USER,
      pass_length: process.env.GMAIL_PASS ? process.env.GMAIL_PASS.length : 0
    });
    return false;
  }
};

// Start server with email verification
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  // Check email configuration but don't stop server if it fails
  const emailConfigValid = await verifyEmailConfig();
  if (!emailConfigValid) {
    console.warn('Warning: Email service is not configured correctly. OTP features may not work.');
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
