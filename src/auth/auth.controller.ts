import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  async register(
    @Body()
    body: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    },
  ) {
    const userExists = await this.usersService.findByEmail(body.email);
    if (userExists) {
      throw new UnauthorizedException('Email already in use');
    }
    return this.usersService.create({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: body.password,
    });
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const token = await this.authService.login(body.email, body.password);
    console.log('Token:', token);
    return token;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() user: any) {
    return user;
  }
}
