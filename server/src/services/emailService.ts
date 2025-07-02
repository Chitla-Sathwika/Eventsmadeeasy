import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Store OTPs temporarily (in production, use Redis or a database)
const otpStore = new Map<string, { otp: string; timestamp: number }>();

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTP = async (email: string): Promise<boolean> => {
  try {
    const otp = generateOTP();
    
    // Store OTP with timestamp (expires in 10 minutes)
    otpStore.set(email, {
      otp,
      timestamp: Date.now()
    });

    console.log('Attempting to send OTP to:', email);
    console.log('Using email:', process.env.EMAIL_USER);

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error('Email credentials are missing');
      return false;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for EventsMadeEaze',
      html: `
        <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px 20px; background-color: #ffffff;">
      <!-- Header with Logo -->
      <div style="text-align: center; padding-bottom: 25px; border-bottom: 1px solid #eaeaea;">
        <h1 style="color: #3b82f6; margin: 0; font-size: 28px; font-weight: 700;">EventsMadeEaze</h1>
        <p style="color: #6b7280; font-size: 16px; margin-top: 5px;">Account Verification</p>
      </div>
      
      <!-- Main Content -->
      <div style="padding: 30px 0; text-align: center;">
        <p style="font-size: 17px; color: #374151; margin-bottom: 25px; line-height: 1.5;">We need to verify your identity. Please use the verification code below:</p>
        
        <!-- OTP Box -->
        <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin: 0 auto; max-width: 300px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
          <p style="font-size: 36px; font-weight: bold; color: #3b82f6; margin: 0; letter-spacing: 3px; font-family: 'Courier New', monospace;">${otp}</p>
        </div>
        
        <p style="font-size: 15px; color: #6b7280; margin-top: 25px; font-weight: 500;">This code expires in <span style="color: #ef4444; font-weight: 600;">10 minutes</span></p>
      </div>
      
      <!-- Security Notice -->
      <div style="background-color: #f9fafb; border-radius: 8px; padding: 15px; margin-bottom: 25px;">
        <p style="font-size: 14px; color: #4b5563; margin: 0; line-height: 1.5;">
          <strong>Security Notice:</strong> If you didn't request this code, please ignore this email or contact our support team immediately.
        </p>
      </div>
      
      <!-- Footer -->
      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eaeaea;">
        <p style="font-size: 13px; color: #9ca3af; margin-bottom: 10px;">© ${new Date().getFullYear()} EventsMadeEaze. All rights reserved.</p>
        <div style="margin-top: 15px;">
          <a href="#" style="color: #6b7280; font-size: 13px; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
          <a href="#" style="color: #6b7280; font-size: 13px; text-decoration: none; margin: 0 10px;">Terms of Service</a>
          <a href="#" style="color: #6b7280; font-size: 13px; text-decoration: none; margin: 0 10px;">Contact Us</a>
        </div>
      </div>
    </div>
      `
    };
    

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    return true;
  } catch (error) {
    console.error('Detailed error sending OTP:', error);
    return false;
  }
};

export const verifyOTP = (email: string, otp: string): boolean => {
  const storedData = otpStore.get(email);
  
  if (!storedData) {
    return false;
  }

  // Check if OTP has expired (10 minutes)
  if (Date.now() - storedData.timestamp > 10 * 60 * 1000) {
    otpStore.delete(email);
    return false;
  }

  const isValid = storedData.otp === otp;
  
  if (isValid) {
    otpStore.delete(email);
  }

  return isValid;
};