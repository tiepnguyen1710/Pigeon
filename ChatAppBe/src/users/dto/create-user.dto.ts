import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsInt, Min, Max } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  role?: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(150)
  age?: number;

  @IsString()
  @IsOptional()
  gender?: string;
}

export class RegisterUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(150)
  age?: number;

  @IsString()
  @IsOptional()
  gender?: string;
}
