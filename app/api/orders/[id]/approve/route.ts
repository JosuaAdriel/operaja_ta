import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();
  try {
    // 1. Get the order details
    const { rows: orders } = await pool.query(
      'SELECT * FROM orders WHERE id = $1 AND status = $2',
      [id, 'pending']
    );
    if ((orders as any[]).length === 0) {
      return NextResponse.json(
        { error: 'Order not found or not pending' },
        { status: 404 }
      );
    }
    // Update status order menjadi 'approved'
    await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2',
      ['approved', id]
    );
    return NextResponse.json({
      message: 'Negosiasi berhasil disetujui!',
      status: 'success'
    });
  } catch (error) {
    console.error('Error approving negotiation:', error);
    return NextResponse.json(
      { error: 'Failed to approve negotiation' },
      { status: 500 }
    );
  }
} 