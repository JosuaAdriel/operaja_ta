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
    // 2. Update order status to cancelled
    await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2',
      ['cancelled', id]
    );
    return NextResponse.json({
      message: 'Negosiasi berhasil ditolak!',
      status: 'success'
    });
  } catch (error) {
    console.error('Error rejecting negotiation:', error);
    return NextResponse.json(
      { error: 'Failed to reject negotiation' },
      { status: 500 }
    );
  }
} 