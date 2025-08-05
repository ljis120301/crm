import { NextResponse } from 'next/server';
import { authenticateUser, createSession } from '../../../../lib/auth';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const user = await authenticateUser(username, password);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Create session
    const session = await createSession(user.id);

    // Set session cookie
    const response = NextResponse.json(
      { 
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        }
      },
      { status: 200 }
    );

    const cookieSecure = process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_HTTPS === 'true';
    console.log('Setting session cookie (login):', {
      hasToken: !!session.token,
      secure: cookieSecure,
      nodeEnv: process.env.NODE_ENV,
      httpsEnabled: process.env.NEXT_PUBLIC_HTTPS
    });

    response.cookies.set('session-token', session.token, {
      httpOnly: true,
      secure: cookieSecure,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 