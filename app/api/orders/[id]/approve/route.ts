import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;

    // 1. Get the order details
    const [orders] = await pool.execute(
      'SELECT * FROM orders WHERE id = ? AND status = "pending"',
      [orderId]
    );

    if ((orders as any[]).length === 0) {
      return NextResponse.json(
        { error: 'Order not found or not pending' },
        { status: 404 }
      );
    }

    // Update status order menjadi 'approved'
    await pool.execute(
      'UPDATE orders SET status = "approved" WHERE id = ?',
      [orderId]
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