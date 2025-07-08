import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
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
    const data = await req.json();
    
    // Cek apakah user sudah punya info bisnis
    const { rows: existing } = await db.query('SELECT id FROM info_bisnis WHERE user_id = $1', [userId]);
    if ((existing as any[]).length > 0) {
      return NextResponse.json({ message: 'User already registered as business donor' }, { status: 400 });
    }
    
    // Insert ke info_bisnis
    await db.query(
      `INSERT INTO info_bisnis (user_id, nama, kategori, alamat, rata_rata_pendapatan, nama_narahubung, nomor_telepon, email_narahubung, nib, sertifikat_halal, pirt, npwp, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'approved')`,
      [
        userId,
        data.nama,
        data.kategori,
        data.alamat,
        data.rata_rata_pendapatan,
        data.nama_narahubung,
        data.nomor_telepon,
        data.email_narahubung,
        data.nib,
        data.sertifikat_halal,
        data.pirt,
        data.npwp
      ]
    );
    
    // Update status user
    await db.query('UPDATE users SET is_business_donor = 1 WHERE id = $1', [userId]);
    
    return NextResponse.json({ message: 'Business donor registered successfully', status: 'success' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to register business donor', error: error }, { status: 500 });
  }
} 