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
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Register new user (Admin only)' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Admin access required',
  })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstName: { type: 'string', example: 'John' },
        lastName: { type: 'string', example: 'Doe' },
        email: { type: 'string', example: 'john@example.com' },
        password: { type: 'string', example: 'securePassword123' },
      },
    },
  })
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
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 attempts per minute
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 201,
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        refresh_token: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'admin@gmail.com' },
        password: { type: 'string', example: 'admin' },
      },
    },
  })
  async login(@Body() body: { email: string; password: string }) {
    const tokens = await this.authService.login(body.email, body.password);
    return tokens;
  }

  @Post('refresh')
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 attempts per minute
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 201, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 403, description: 'Invalid refresh token' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: { type: 'string', example: 'your-refresh-token-here' },
      },
    },
  })
  async refresh(@Body() body: { refreshToken: string }) {
    if (!body.refreshToken) {
      throw new ForbiddenException('Missing refresh token');
    }
    return this.authService.refresh(body.refreshToken);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMe(@CurrentUser() user: any) {
    return user;
  }
}
