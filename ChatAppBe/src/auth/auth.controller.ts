import { Controller, Post, Body, UseGuards, Req, Res, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterUserDto } from '../users/dto/create-user.dto';
import { Public } from 'src/decorators/customize';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * POST /auth/login
   * Login with email and password
   * Uses LocalStrategy for validation
   */
  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(req.user as any, res);
  }

  /**
   * POST /auth/register
   * Register new user
   */
  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterUserDto) {
    return this.authService.register(registerDto);
  }

  /**
   * POST /auth/logout
   * Logout and clear refresh token
   * Requires JWT authentication
   */

  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logout(req.user as any, res);
  }

  /**
   * POST /auth/refresh
   * Get new access token using refresh token
   * Refresh token can be from cookie or request body
   */
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body('refresh_token') bodyRefreshToken?: string,
  ) {
    // Get refresh token from cookie or body
    const refreshToken = req.cookies?.refresh_token || bodyRefreshToken;
    return this.authService.refreshToken(refreshToken, res);
  }

  /**
   * GET /auth/profile
   * Get current user profile
   * Requires JWT authentication
   */
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Req() req: Request) {
    return this.authService.getProfile(req.user as any);
  }
}
