import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { UserGuard } from 'src/guards/user.guard';
import { Request as Req } from 'express';
import { User } from '@prisma/client';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  @Post('/login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @UseGuards(UserGuard)
  @Get('/me')
  loggedInUser(@Request() req: Req) {
    const user = req['user'] as User;
    return this.authService.currentUser(user.id);
  }

  @Post('/reset-password')
  resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body);
  }

  @UseGuards(UserGuard)
  @Patch('/update-password')
  updatePassword(@Request() req: any, @Body() body: UpdatePasswordDto) {
    return this.authService.updatePassword(req.currentUser as User, body);
  }

  @UseGuards(UserGuard)
  @Get('/refresh-token')
  refreshToken(@Request() req: Req) {
    const user = req['user'] as User;
    return this.authService.refreshToken(user.email);
  }

  @Post('/forgot-password')
  sendPasswordResetLink(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body);
  }
}
