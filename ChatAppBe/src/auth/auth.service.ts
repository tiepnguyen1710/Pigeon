import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { RegisterUserDto } from '../users/dto/create-user.dto';
import { IUser } from '../users/users.interface';
import { UsersService } from '../users/users.service';


@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(username);
        if(!user) {
            throw new UnauthorizedException("Invalid Email !");
        }
        if(user && this.usersService.IsCorrectPassword(pass, user.password)){
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: IUser, res: Response) {
        const {id, username, email, role} = user;

        const payload = {
            sub: 'token login',
            iss: 'from server',
            id,
            username,
            email, 
            role
        };

        let refresh_token = this.createRefreshToken(payload);

        await this.usersService.assignRefreshToken(refresh_token, id);

        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        });

        const access_token = this.jwtService.sign(payload);
        return {
          access_token,
          refresh_token,
          user: {
            id,
            username,
            email,
            role,
          }
        };
      }

      createRefreshToken(payload: Record<string, any>): string {
        const expiresIn = this.configService.get<number>('EXPIRE_IN_REFRESH') || 604800; // 7 days in seconds
        const refresh_token = this.jwtService.sign(payload, {
          secret: this.configService.get<string>('SECRET_KEY_REFRESH'),
          expiresIn,
        });
    
        return refresh_token;
      }

      async register(user: RegisterUserDto){
        const newUser = await this.usersService.register(user);

        return {
          id: newUser.id,
          username: newUser.username,
        }
      }

      /**
       * Logout - Clear refresh token from database and cookie
       */
      async logout(user: IUser, res: Response) {
        await this.usersService.clearRefreshToken(user.id);
        
        res.clearCookie('refresh_token');
        
        return {
          message: 'Logout successfully',
        };
      }

      /**
       * Refresh Token - Get new access token using refresh token
       */
      async refreshToken(refreshToken: string, res: Response) {
        if (!refreshToken) {
          throw new BadRequestException('Refresh token is required');
        }

        try {
          // Verify refresh token
          const payload = this.jwtService.verify(refreshToken, {
            secret: this.configService.get<string>('SECRET_KEY_REFRESH'),
          });

          // Find user and check if refresh token matches
          const user = await this.usersService.findOneById(payload.id);
          if (!user || user.refreshToken !== refreshToken) {
            throw new UnauthorizedException('Invalid refresh token');
          }

          // Create new tokens
          const newPayload = {
            sub: 'token login',
            iss: 'from server',
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
          };

          const new_refresh_token = this.createRefreshToken(newPayload);
          await this.usersService.assignRefreshToken(new_refresh_token, user.id);

          res.cookie('refresh_token', new_refresh_token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
          });

          const access_token = this.jwtService.sign(newPayload);

          return {
            access_token,
            refresh_token: new_refresh_token,
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              role: user.role,
            }
          };
        } catch (error) {
          throw new UnauthorizedException('Invalid or expired refresh token');
        }
      }

      /**
       * Get Profile - Get current user profile from JWT
       */
      async getProfile(user: IUser) {
        const fullUser = await this.usersService.findOneById(user.id);
        
        if (!fullUser) {
          throw new UnauthorizedException('User not found');
        }

        const { password, refreshToken, ...result } = fullUser;
        return result;
      }
}

