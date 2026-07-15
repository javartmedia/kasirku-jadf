import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/services/auth.service';
import { loginSchema } from '@/lib/validations';
import { setTokenCookie } from '@/lib/jwt';
import { rateLimit } from '@/lib/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
});

export async function POST(request: NextRequest) {
  try {
    await limiter.check(5, 'LOGIN_RATE_LIMIT');
    
    const body = await request.json();
    const validatedData = loginSchema.parse(body);
    
    const result = await authService.login(validatedData);
    
    const response = NextResponse.json({
      success: true,
      user: result.user,
      token: result.token,
    });
    
    response.cookies.set('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400,
      path: '/',
    });
    
    return response;
  } catch (error: any) {
    if (error.code === '429') {
      return NextResponse.json(
        { error: 'Terlalu banyak percobaan login. Silakan coba lagi.' },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan' },
      { status: error.message.includes('salah') ? 401 : 400 }
    );
  }
}
