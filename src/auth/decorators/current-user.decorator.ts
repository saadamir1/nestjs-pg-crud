import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Custom decorator that extracts the authenticated user from the request.
 * Use inside controllers to access `req.user` set by the JWT strategy.
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // Switch to HTTP context and extract request object
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
/**
 * Usage:
 *
 * @Get('profile')
 * @UseGuards(JwtAuthGuard)
 * getProfile(@CurrentUser() user: any) {
 *   return user; // Returns the authenticated user object
 * }
 */
