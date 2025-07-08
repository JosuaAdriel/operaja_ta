import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;

    // Get order details with food and user information
    const [rows] = await pool.execute(`
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
      WHERE orders.id = ?
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

    // 1. Get the order details
    const [orders] = await pool.execute(
      'SELECT * FROM orders WHERE id = ? AND status = "approved"',
      [orderId]
    );

    if ((orders as any[]).length === 0) {
      return NextResponse.json(
        { error: 'Order not found or not approved' },
        { status: 404 }
      );
    }

    const order = (orders as any[])[0];

    // 2. Update order status to confirmed
    await pool.execute(
      'UPDATE orders SET status = "confirmed" WHERE id = ?',
      [orderId]
    );

    // 3. Update food status to ordered
    await pool.execute(
      'UPDATE food_items SET status = "ordered" WHERE id = ?',
      [order.food_item_id]
    );

    // 4. Get food details to calculate savings and waste
    const [foods] = await pool.execute(
      'SELECT weight FROM food_items WHERE id = ?',
      [order.food_item_id]
    );
    
    if ((foods as any[]).length > 0) {
      const food = (foods as any[])[0];
      
      // 5. Update total penghematan dan sampah yang diselamatkan untuk user
      const savingsAmount = parseFloat(order.order_amount) * 2; // price_patungan * 2
      const wasteSaved = food.weight || 0; // weight makanan

      await pool.execute(
        'UPDATE users SET total_savings = total_savings + ?, total_waste_saved = total_waste_saved + ? WHERE id = ?',
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