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
      'SELECT * FROM orders WHERE id = ? AND status = "confirmed"',
      [orderId]
    );

    if ((orders as any[]).length === 0) {
      return NextResponse.json(
        { error: 'Order not found or not confirmed' },
        { status: 404 }
      );
    }

    // 2. Update order status to completed
    await pool.execute(
      'UPDATE orders SET status = "completed" WHERE id = ?',
      [orderId]
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