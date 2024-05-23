import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/util/prisma/prisma.service';
import { SignupDto } from './dtos/signup.dto';
import { RoleEnum, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import * as jwt from 'jsonwebtoken';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { MailService } from 'src/util/mail/mail.service';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';

const saltRounds = 12;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async signup(user: SignupDto) {
    const dbUser = await this.prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });
    if (dbUser) throw new BadRequestException();
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    const newUser = await this.prisma.user.create({
      data: {
        ...user,
        password: hashedPassword,
        passwordUpdatedAt: new Date().toISOString(),
        roles: {
          create: [
            {
              id: '3',
              role: RoleEnum.USER,
            },
          ],
        },
      },
    });
    delete newUser.password;
    delete newUser.passwordUpdatedAt;
    return newUser;
  }

  async login(email: string, password: string) {
    const dbUser = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        roles: true,
      },
    });
    if (!dbUser) throw new UnauthorizedException();
    const isPasswordCorrect = await bcrypt.compare(password, dbUser.password);
    if (!isPasswordCorrect) throw new UnauthorizedException();
    delete dbUser.password;
    dbUser['accessToken'] = jwt.sign(dbUser, process.env.JWT_SECRET, {
      // expires after 1 hour
      expiresIn: '3600s',
    });
    dbUser['refreshToken'] = jwt.sign(dbUser, process.env.JWT_SECRET, {
      // expires after 7 days
      expiresIn: '604800s',
    });
    return dbUser;
  }

  async currentUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        roles: true,
      },
    });
    return user;
  }

  async refreshToken(email: string) {
    const dbUser = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        roles: true,
      },
    });
    if (!dbUser) throw new UnauthorizedException();
    const newToken = jwt.sign(dbUser, process.env.JWT_SECRET, {
      // expires after 1 hour
      expiresIn: '3600s',
    });
    return {
      accessToken: newToken,
    };
  }

  async resetPassword(body: ResetPasswordDto) {
    const dbEntry = await this.prisma.passwordResetToken.findUnique({
      where: {
        email: body.email,
        token: body.token,
      },
    });
    try {
      if (dbEntry) {
        jwt.verify(dbEntry.token, process.env.JWT_SECRET);
        const hashedPassword = await bcrypt.hash(body.newPassword, saltRounds);
        await this.prisma.user.update({
          where: {
            email: body.email,
          },
          data: {
            password: hashedPassword,
            passwordUpdatedAt: new Date().toISOString(),
          },
        });
        await this.prisma.passwordResetToken.deleteMany({
          where: {
            email: body.email,
          },
        });

        return {
          message: 'Password updated successfully',
        };
      }
    } catch (err: any) {
      throw new BadRequestException();
    }
    throw new BadRequestException();
  }

  async updatePassword(user: User, body: UpdatePasswordDto) {
    const dbUsr = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
    const isSamePassword = await bcrypt.compare(
      body.oldPassword,
      dbUsr.password,
    );
    if (!isSamePassword) throw new BadRequestException();
    const hashedPassword = await bcrypt.hash(body.newPassword, saltRounds);
    const dbUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
        passwordUpdatedAt: new Date().toISOString(),
      },
    });
    delete dbUser.password;
    return dbUser;
  }

  async forgotPassword(body: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (user) this.mailService.sendPasswordResetLink(user.name, body.email);
    return {
      message:
        'You will receive a password reset link on your entered email if you have registered on this site.',
    };
  }
}
