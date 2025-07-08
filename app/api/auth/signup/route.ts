import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { rows: existingUsers } = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if ((existingUsers as any[]).length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id',
      [email, hashedPassword]
    );
    const userId = result.rows[0].id;

        // Generate auth token
        const token = generateToken(userId, email);
    
        // Set cookie
        const response = NextResponse.json({
          message: 'User created successfully',
          userId,
          status: 'success'
        });
        
        response.cookies.set('auth-token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7 // 7 days
        });
    

    return NextResponse.json({
      message: 'User created successfully',
      userId,
      status: 'success'
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 