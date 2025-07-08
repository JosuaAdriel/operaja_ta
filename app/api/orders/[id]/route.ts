import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;

    // GET order details
    const { rows } = await pool.query(`
      SELECT orders.*, 
        food_items.name AS food_name,
        food_items.image_url AS food_image,
        food_items.price_patungan,
        food_items.location_address,
        food_items.location_details,
        food_items.availability,
        food_items.weight AS food_weight,
        users.name AS provider_name,
        users.avatar AS provider_avatar,
        users.rating AS provider_rating,
        users.reviews_count AS provider_reviews,
        customer.name AS customer_name,
        customer.avatar AS customer_avatar,
        customer.rating AS customer_rating,
        customer.reviews_count AS customer_reviews
      FROM orders
      JOIN food_items ON orders.food_item_id = food_items.id
      JOIN users ON food_items.provider_id = users.id
      JOIN users customer ON orders.user_id = customer.id
      WHERE orders.id = $1
    `, [orderId]);

    if (!(rows as any[]).length) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: (rows as any[])[0],
      status: 'success'
    });
  } catch (error) {
    console.error('Error fetching order details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order details' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;

    // POST approve order
    const { rows: orders } = await pool.query(
      'SELECT * FROM orders WHERE id = $1 AND status = $2',
      [orderId, 'approved']
    );
    if ((orders as any[]).length === 0) {
      return NextResponse.json(
        { error: 'Order not found or not approved' },
        { status: 404 }
      );
    }
    const order = (orders as any[])[0];
    await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2',
      ['confirmed', orderId]
    );
    await pool.query(
      'UPDATE food_items SET status = $1 WHERE id = $2',
      ['ordered', order.food_item_id]
    );
    const { rows: foods } = await pool.query(
      'SELECT weight FROM food_items WHERE id = $1',
      [order.food_item_id]
    );
    if ((foods as any[]).length > 0) {
      const food = (foods as any[])[0];
      const savingsAmount = parseFloat(order.order_amount) * 2;
      const wasteSaved = food.weight || 0;
      await pool.query(
        'UPDATE users SET total_savings = total_savings + $1, total_waste_saved = total_waste_saved + $2 WHERE id = $3',
        [savingsAmount, wasteSaved, order.user_id]
      );
    }

    return NextResponse.json({
      message: 'Pembayaran berhasil dikonfirmasi!',
      status: 'success'
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    return NextResponse.json(
      { error: 'Failed to confirm payment' },
      { status: 500 }
    );
  }
} 