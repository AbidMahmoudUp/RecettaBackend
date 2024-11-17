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
      html: `<p>You requested a password reset. :</p><p>${token}</p>`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}