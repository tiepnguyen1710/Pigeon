import { Injectable, UnauthorizedException } from '@nestjs/common';
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
}

