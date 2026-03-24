require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTPEmail = async (email, otp, name) => {
  const mailOptions = {
    from: `"PaperPilot" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'PaperPilot - Verify Your Email',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #0f0f0f; border-radius: 16px; overflow: hidden; border: 1px solid #2a2a2a;">
        <div style="padding: 40px 32px; text-align: center;">
          <h1 style="color: #10b981; font-size: 24px; margin: 0 0 8px;">PaperPilot</h1>
          <p style="color: #a0a0a0; font-size: 14px; margin: 0 0 32px;">Email Verification</p>
          
          <p style="color: #e0e0e0; font-size: 16px; margin: 0 0 24px;">Hello ${name},</p>
          <p style="color: #a0a0a0; font-size: 14px; margin: 0 0 16px;">Your verification code is:</p>
          
          <div style="background: #1a1a2e; border: 1px solid #10b981; border-radius: 12px; padding: 20px; margin: 0 0 24px; display: inline-block;">
            <span style="font-size: 36px; font-weight: 700; color: #10b981; letter-spacing: 8px;">${otp}</span>
          </div>
          
          <p style="color: #a0a0a0; font-size: 13px; margin: 0 0 8px;">This code expires in <strong style="color: #e0e0e0;">10 minutes</strong></p>
          <p style="color: #666; font-size: 12px; margin: 24px 0 0;">If you did not request this, please ignore this email.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOTPEmail };
