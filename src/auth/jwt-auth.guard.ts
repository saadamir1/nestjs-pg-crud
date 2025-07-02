import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT Auth Guard that protects routes using the 'jwt' strategy.
 * It triggers the JwtStrategy, which validates the token and attaches the payload to request.user.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
/**
 * Usage:
 *
 * @Get('me')
 * @UseGuards(JwtAuthGuard)
 * getProtectedRoute(@CurrentUser() user: any) {
 *   return user; // Returns the authenticated user object
 * }
 */
