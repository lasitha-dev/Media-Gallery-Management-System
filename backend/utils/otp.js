import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// Generate OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via email
export const sendOTP = async (email, otp, type = 'verification') => {
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
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
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
