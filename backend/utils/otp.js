import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create transporter function
const createTransporter = () => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    throw new Error('Gmail credentials are not configured in environment variables');
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS.replace(/\s+/g, '')
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Export transporter instance
export const transporter = createTransporter();

// Generate OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via email
export const sendOTP = async (email, otp, type = 'verification') => {
  console.log('Attempting to send OTP email...');
  
  // Verify transporter configuration
  try {
    await transporter.verify();
    console.log('SMTP connection verified successfully');
  } catch (error) {
    console.error('SMTP Verification Error:', error);
    return false;
  }

  console.log('Email configuration:', {
    from: process.env.GMAIL_USER,
    to: email,
    gmailPass: process.env.GMAIL_PASS ? 'Length: ' + process.env.GMAIL_PASS.length : '(not set)'
  });

  const subject = type === 'verification' ? 'Email Verification OTP' : 'Reset Password OTP';
  const message = type === 'verification' 
    ? `Your email verification OTP is: ${otp}. Valid for 10 minutes.`
    : `Your password reset OTP is: ${otp}. Valid for 10 minutes.`;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject,
    text: message
  };

  try {
    console.log('Sending email with options:', { ...mailOptions, otp });
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info);
    return true;
  } catch (error) {
    console.error('Error sending email:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    return false;
  }
};

// Verify OTP
export const verifyOTP = (storedOTP, providedOTP, expiresAt) => {
  if (!storedOTP || !expiresAt) {
    return false;
  }

  if (Date.now() > expiresAt) {
    return false;
  }

  return storedOTP === providedOTP;
};
