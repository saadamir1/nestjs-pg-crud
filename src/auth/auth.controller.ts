import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Get,
  UseGuards,
  Req,
  ForbiddenException,
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
    const tokens = await this.authService.login(body.email, body.password);
    return tokens;
  }

  @Post('refresh')
  async refresh(@Body() body: { userId: number; refreshToken: string }) {
    if (!body.userId || !body.refreshToken) {
      throw new ForbiddenException('Missing credentials');
    }
    return this.authService.refresh(body.userId, body.refreshToken);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() user: any) {
    return user;
  }
}
