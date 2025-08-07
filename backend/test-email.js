import { transporter } from './utils/otp.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testEmail() {
  try {
    // First verify the connection
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('SMTP connection verified successfully');

    // Try sending a test email
    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER, // Send to yourself
      subject: 'Test Email',
      text: 'If you receive this email, the SMTP configuration is working correctly.'
    });

    console.log('Test email sent successfully:', info);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testEmail();
