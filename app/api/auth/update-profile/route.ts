import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import pool from '@/lib/db';

export async function PUT(request: Request) {
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

    const body = await request.json();
    const {
      name,
      fullName,
      address,
      phoneNumber,
      idNumber,
      ktpPhoto,
      bankName,
      accountNumber,
      avatar
    } = body;

    // Update user profile
    const result = await pool.query(
      `UPDATE users SET 
        name = $1, 
        full_name = $2, 
        address = $3, 
        phone_number = $4, 
        id_number = $5, 
        ktp_photo = $6, 
        bank_name = $7, 
        account_number = $8,
        avatar = $9,
        is_verified = TRUE
      WHERE id = $10`,
      [
        name,
        fullName,
        address,
        phoneNumber,
        idNumber,
        ktpPhoto,
        bankName,
        accountNumber,
        avatar,
        decoded.userId
      ]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      status: 'success'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 