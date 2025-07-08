import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import pool from '@/lib/db';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth-token')?.value;

    if (!authToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(authToken);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get user data
    const { rows: users } = await pool.query(
      'SELECT id, email, name, avatar, full_name, address, phone_number, bank_name, account_number, rating, reviews_count, total_savings, total_waste_saved, is_verified FROM users WHERE id = $1',
      [decoded.userId]
    );

    if ((users as any[]).length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = (users as any[])[0];

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        fullName: user.full_name,
        address: user.address,
        phoneNumber: user.phone_number,
        rating: user.rating,
        reviewsCount: user.reviews_count,
        totalSavings: user.total_savings,
        totalWasteSaved: user.total_waste_saved,
        isVerified: user.is_verified,
        bankName: user.bank_name,
        accountNumber: user.account_number
      },
      status: 'success'
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 