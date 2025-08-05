import { NextResponse } from 'next/server';
import { authenticateAdmin, createSession } from '../../../../lib/auth';
import { prisma } from '../../../../lib/db';

export async function POST(request) {
  try {
    const { adminPassword } = await request.json();

    if (!adminPassword) {
      return NextResponse.json(
        { error: 'Admin password is required' },
        { status: 400 }
      );
    }

    // Debug logging
    console.log('Admin login attempt:', {
      hasPassword: !!adminPassword,
      adminPasswordEnv: !!process.env.ADMIN_PASSWORD,
      nodeEnv: process.env.NODE_ENV,
      httpsEnabled: process.env.NEXT_PUBLIC_HTTPS
    });

    const isValid = await authenticateAdmin(adminPassword);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid admin password' },
        { status: 401 }
      );
    }

    // Create or get admin user
    let adminUser = await prisma.user.findFirst({
      where: { role: 'admin' },
    });

    if (!adminUser) {
      // Create admin user if it doesn't exist
      adminUser = await prisma.user.create({
        data: {
          username: 'admin',
          password: 'admin', // This will be hashed but not used for login
          role: 'admin',
        },
      });
    }

    // Create session
    const session = await createSession(adminUser.id);

    // Set session cookie
    const response = NextResponse.json(
      { 
        message: 'Admin login successful',
        user: {
          id: adminUser.id,
          username: adminUser.username,
          role: adminUser.role,
        }
      },
      { status: 200 }
    );

    const cookieSecure = process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_HTTPS === 'true';
    console.log('Setting session cookie:', {
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
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 