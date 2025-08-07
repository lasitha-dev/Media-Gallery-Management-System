import User from '../models/User.js';
import { generateOTP, sendOTP, verifyOTP as verifyOTPUtil } from '../utils/otp.js';
import crypto from 'crypto';

// Register user
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user
    user = await User.create({
      name,
      email,
      password
    });

    // Generate OTP
    const otp = generateOTP();
    user.otp = {
      code: otp,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    };
    await user.save();

    // Send OTP
    const emailSent = await sendOTP(email, otp);
    
    if (!emailSent) {
      // If email fails, delete the user and return error
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email. Please try again.'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email.',
      debug: { otp } // WARNING: Remove this in production. Only for testing!
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error in registration'
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is verified
    if (!user.verified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email first'
      });
    }

    // Create token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error in login'
    });
  }
};

// Verify OTP
export const verifyUserOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (verifyOTPUtil(user.otp.code, otp, user.otp.expiresAt)) {
      user.verified = true;
      user.otp = undefined;
      await user.save();

      const token = user.getSignedJwtToken();

      res.status(200).json({
        success: true,
        message: 'Email verified successfully',
        token
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error in OTP verification'
    });
  }
};

// Resend OTP
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const otp = generateOTP();
    user.otp = {
      code: otp,
      expiresAt: Date.now() + 10 * 60 * 1000
    };
    await user.save();

    await sendOTP(email, otp);

    res.status(200).json({
      success: true,
      message: 'OTP resent successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error in resending OTP'
    });
  }
};

// Forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const otp = generateOTP();
    user.otp = {
      code: otp,
      expiresAt: Date.now() + 10 * 60 * 1000
    };
    await user.save();

    await sendOTP(email, otp, 'reset');

    res.status(200).json({
      success: true,
      message: 'Password reset OTP sent successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error in forgot password'
    });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (verifyOTP(user.otp.code, otp, user.otp.expiresAt)) {
      user.password = newPassword;
      user.otp = undefined;
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Password reset successful'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error in password reset'
    });
  }
};

// Google OAuth callback
export const googleCallback = async (req, res) => {
  try {
    // Get user information from Google OAuth
    const { id, email, displayName } = req.user;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        name: displayName,
        email,
        googleId: id,
        verified: true, // Google OAuth users are automatically verified
        password: crypto.randomBytes(20).toString('hex') // Random password for Google users
      });
    } else {
      // Update existing user's Google ID if not set
      if (!user.googleId) {
        user.googleId = id;
        await user.save();
      }
    }

    // Create token
    const token = user.getSignedJwtToken();

    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  } catch (error) {
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?error=true`);
  }
};
