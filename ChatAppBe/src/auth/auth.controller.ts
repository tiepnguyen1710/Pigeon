import { Controller, Post, Body, UseGuards, Req, Res} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import express from 'express';
import { AuthService } from './auth.service';
import { RegisterUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * POST /auth/login
   * Login with email and password
   * Uses LocalStrategy for validation
   */
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @Req() req,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    return this.authService.login(req.user, res);
  }

  /**
   * POST /auth/register
   * Register new user
   */
  @Post('register')
  async register(@Body() registerDto: RegisterUserDto) {
    return this.authService.register(registerDto);
  }
}
