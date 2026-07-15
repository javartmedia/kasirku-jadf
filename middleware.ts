import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

const protectedRoutes = [
  '/dashboard',
  '/menu',
  '/categories',
  '/tables',
  '/orders',
  '/payments',
  '/customers',
  '/expenses',
  '/stock',
  '/purchases',
  '/reports',
  '/users',
  '/settings',
  '/shift',
];

const authRoutes = ['/login'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Redirect ke dashboard jika sudah login dan mengakses halaman auth
  if (authRoutes.some(route => pathname.startsWith(route)) && token) {
    const decoded = verifyToken(token);
    if (decoded) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Proteksi route yang memerlukan autentikasi
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  // Proteksi API routes
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/')) {
    const authorization = request.headers.get('authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const apiToken = authorization.substring(7);
    const decoded = verifyToken(apiToken);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
};
