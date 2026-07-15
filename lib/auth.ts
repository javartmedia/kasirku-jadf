import { verifyToken, JWTPayload } from './jwt';
import { headers } from 'next/headers';

export async function getCurrentUser(): Promise<JWTPayload | null> {
  const headersList = headers();
  const authorization = headersList.get('authorization');
  
  if (!authorization?.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authorization.substring(7);
  return verifyToken(token);
}

export function requireAuth(user: JWTPayload | null): asserts user is JWTPayload {
  if (!user) {
    throw new Error('Unauthorized');
  }
}

export function hasPermission(user: JWTPayload, permission: string): boolean {
  return user.permissions.includes(permission) || user.role === 'owner';
}

export function requirePermission(user: JWTPayload, permission: string): void {
  if (!hasPermission(user, permission)) {
    throw new Error('Forbidden');
  }
}
