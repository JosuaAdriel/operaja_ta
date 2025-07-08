import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    
    if (!user_id) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    }

    // Get all orders for this user with food details
    const [rows] = await pool.execute(`
      SELECT orders.*, 
        food_items.name AS food_name,
        food_items.image_url AS food_image,
        food_items.price_patungan,
        users.name AS provider_name,
        users.avatar AS provider_avatar,
        users.rating AS provider_rating,
        users.reviews_count AS provider_reviews
      FROM orders
      JOIN food_items ON orders.food_item_id = food_items.id
      JOIN users ON food_items.provider_id = users.id
      WHERE orders.user_id = ?
      ORDER BY orders.created_at DESC
    `, [user_id]);

    return NextResponse.json({
      data: rows,
      status: 'success'
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user orders' },
      { status: 500 }
    );
  }
} 