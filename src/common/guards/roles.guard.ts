import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * RolesGuard is responsible for role-based access control (RBAC).
 *
 * It reads the roles defined using the @Roles() decorator and compares them
 * with the current authenticated user's role (from request.user).
 *
 * If no roles are specified on the route, access is allowed by default.
 * If roles are defined, only users whose role matches one of the allowed roles
 * will be granted access.
 */

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get roles defined via @Roles() from the route handler or controller
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no roles are required, allow access
    if (!requiredRoles) {
      return true;
    }

    // Extract the authenticated user from the request
    const { user } = context.switchToHttp().getRequest();

    // Check if the user's role matches any of the required roles
    return requiredRoles.includes(user.role);
  }
}
