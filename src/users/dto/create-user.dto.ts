// src/users/dto/create-user.dto.ts
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password (min 4 characters)',
  })
  @MinLength(4, { message: 'Password must be at least 4 characters long' })
  password: string;

  @ApiProperty({ example: 'John', description: 'User first name' })
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @ApiProperty({ example: 'Wick', description: 'User last name' })
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @ApiProperty({
    example: 'user',
    description: 'User role',
    enum: ['user', 'admin'],
    required: false,
  })
  @IsEnum(['user', 'admin'], { message: 'Role must be either user or admin' })
  role?: 'user' | 'admin';

  @IsOptional()
  refreshToken?: string;

  @ApiProperty({
    example:
      'https://res.cloudinary.com/demo/image/upload/v1234567890/avatars/profile.jpg',
    description: 'URL of the user profile picture',
    required: false,
  })
  @IsString()
  @IsOptional()
  profilePicture?: string;

  @IsOptional()
  isEmailVerified?: boolean;
}
