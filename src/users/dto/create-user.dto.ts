// src/users/dto/create-user.dto.ts
import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(4, { message: 'Password must be at least 4 characters long' })
  password: string;

  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @IsEnum(['user', 'admin'], { message: 'Role must be either user or admin' })
  role?: 'user' | 'admin';
}
