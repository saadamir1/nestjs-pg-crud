import { SetMetadata } from '@nestjs/common';

/**
 * Metadata key used to store roles on route handlers and controllers.
 * This key is used by the RolesGuard to retrieve the required roles.
 */
export const ROLES_KEY = 'roles';

/**
 * Custom @Roles() decorator to specify which roles are allowed to access a route.
 *
 * Usage:
 * @Roles('admin') → only users with role 'admin' can access the route.
 *
 * This sets metadata that will later be checked by RolesGuard.
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
