import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth-token')?.value;

    if (!authToken) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyToken(authToken);
    if (!decoded) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const userId = decoded.userId;
    
    // Cek status donatur bisnis
    const { rows: userRows } = await db.query('SELECT is_business_donor FROM users WHERE id = $1', [userId]);
    const isBusinessDonor = (userRows as any[])[0]?.is_business_donor || false;
    
    // Jika sudah donatur bisnis, ambil info bisnis
    let infoBisnis = null;
    if (isBusinessDonor) {
      const { rows: businessRows } = await db.query('SELECT * FROM info_bisnis WHERE user_id = $1', [userId]);
      if ((businessRows as any[]).length > 0) {
        infoBisnis = (businessRows as any[])[0];
      }
    }
    
    return NextResponse.json({
      isBusinessDonor,
      infoBisnis,
      status: 'success'
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to get business donor status', error: error }, { status: 500 });
  }
} 