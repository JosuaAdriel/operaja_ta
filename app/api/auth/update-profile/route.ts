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
    const [result] = await pool.execute(
      `UPDATE users SET 
        name = ?, 
        full_name = ?, 
        address = ?, 
        phone_number = ?, 
        id_number = ?, 
        ktp_photo = ?, 
        bank_name = ?, 
        account_number = ?,
        avatar = ?,
        is_verified = TRUE
      WHERE id = ?`,
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

    if ((result as any).affectedRows === 0) {
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