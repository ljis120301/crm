import { NextResponse } from 'next/server';
import { deleteSession } from '../../../../lib/auth';

export async function POST(request) {
  try {
    const sessionToken = request.cookies.get('session-token')?.value;

    if (sessionToken) {
      await deleteSession(sessionToken);
    }

    const response = NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );

    response.cookies.delete('session-token');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 