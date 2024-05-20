import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import ForgotPassword from './templates/forgot-password';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport(
      {
        host: this.config.get<string>('EMAIL_SMTP_HOST'),
        port: this.config.get<number>('EMAIL_SMTP_PORT'),
        secure: true,
        auth: {
          user: this.config.get<string>('EMAIL_ACCOUNT_ID'),
          pass: this.config.get<string>('EMAIL_ACCOUNT_PASSWORD'),
        },
      },
      {
        from: {
          name: this.config.get<string>('EMAIL_ACCOUNT_NAME'),
          address: this.config.get<string>('EMAIL_ACCOUNT_ID'),
        },
      },
    );
  }

  async sendPasswordResetLink(userName: string, email: string) {
    const uuid = uuidv4();
    const token = jwt.sign(
      {
        id: uuid,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '600s',
      },
    );
    const dbEntry = await this.prisma.passwordResetToken.create({
      data: {
        email,
        token,
      },
    });
    await this.transporter.sendMail({
      to: email,
      subject: 'Reset your account password | Unacero Technology',
      html: ForgotPassword({
        userName,
        passwordResetLink: `${process.env.FRONT_END_URL}/auth/reset-password?token=${dbEntry.token}&email=${dbEntry.email}`,
      }),
    });
  }
}
