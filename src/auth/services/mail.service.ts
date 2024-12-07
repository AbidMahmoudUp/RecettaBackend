// mail.service.ts
import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: 'ggharbi323@gmail.com',
        pass: 'qaljnbjgssqbqqzq',
      },
    });
  }

  async sendPasswordResetEmail(to: string, token: string) {

    const mailOptions = {
      from: 'Auth-backend service',
      to: to,
      subject: 'Password Reset Request',
      html: `
      <!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
      color: #333333;
    }
    .email-container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background-color: #ff6600; /* Orange */
      color: #ffffff;
      text-align: center;
      padding: 20px;
      font-size: 24px;
    }
    .content {
      padding: 20px;
    }
    .content p {
      margin: 10px 0;
      line-height: 1.6;
    }
    .code {
      display: inline-block;
      margin: 20px 0;
      padding: 10px 20px;
      font-size: 20px;
      font-weight: bold;
      color: #ffffff;
      background-color: #333333; /* Black */
      border-radius: 4px;
      text-align: center;
      letter-spacing: 2px;
    }
    .footer {
      background-color: #333333; /* Black */
      color: #ffffff;
      text-align: center;
      padding: 10px 20px;
      font-size: 14px;
    }
    .footer a {
      color: #ff6600; /* Orange */
      text-decoration: none;
    }
    .footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      Password Reset Request
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>You recently requested to reset your password for your account. Use the code below to complete the process:</p>
      <div class="code">${token}</div>
      <p>If you didn’t request this, please ignore this email or contact support if you have questions.</p>
      <p>Thank you,<br>The Recetta Team</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Recetta. All rights reserved.</p>
      <p><a href="contact@esprit.tn">Contact Support</a></p>
    </div>
  </div>
</body>
</html>

      
      
      `
    };

    await this.transporter.sendMail(mailOptions);
  }
}