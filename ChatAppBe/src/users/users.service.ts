import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Find user by email
   */
  async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Find user by ID
   */
  async findOneById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Find user by username
   */
  async findOneByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  /**
   * Compare plain password with hashed password
   */
  IsCorrectPassword(plainPassword: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  }

  /**
   * Hash password using bcrypt
   */
  hashPassword(password: string): string {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
  }

  /**
   * Assign refresh token to user
   */
  async assignRefreshToken(refreshToken: string, userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }

  /**
   * Register new user
   */
  async register(registerDto: RegisterUserDto): Promise<User> {
    const { email, username, password, age, gender } = registerDto;

    // Check if email already exists
    const existingEmail = await this.findOneByEmail(email);
    if (existingEmail) {
      throw new BadRequestException('Email already exists!');
    }

    // Check if username already exists
    const existingUsername = await this.findOneByUsername(username);
    if (existingUsername) {
      throw new BadRequestException('Username already exists!');
    }

    // Hash password
    const hashedPassword = this.hashPassword(password);

    // Create user
    const newUser = await this.prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        age,
        gender,
        role: 'user',
      },
    });

    return newUser;
  }

  /**
   * Clear refresh token (for logout)
   */
  async clearRefreshToken(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  /**
   * Update user online status
   */
  async updateOnlineStatus(userId: string, isOnline: boolean): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isOnline },
    });
  }
}
