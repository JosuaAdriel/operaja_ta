import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();
  try {
    // 1. Get the order details
    const { rows: orders } = await pool.query(
      'SELECT * FROM orders WHERE id = $1 AND status = $2',
      [id, 'confirmed']
    );
    if ((orders as any[]).length === 0) {
      return NextResponse.json(
        { error: 'Order not found or not confirmed' },
        { status: 404 }
      );
    }
    // 2. Update order status to completed
    await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2',
      ['completed', id]
    );
    return NextResponse.json({
      message: 'Pesanan berhasil diselesaikan!',
      status: 'success'
    });
  } catch (error) {
    console.error('Error completing order:', error);
    return NextResponse.json(
      { error: 'Failed to complete order' },
      { status: 500 }
    );
  }
} 