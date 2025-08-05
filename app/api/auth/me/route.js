import { NextResponse } from 'next/server';
import { getSession } from '../../../../lib/auth';

export async function GET(request) {
  try {
    const sessionToken = request.cookies.get('session-token')?.value;
    const session = await getSession(sessionToken);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      id: session.user.id,
      username: session.user.username,
      role: session.user.role,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 