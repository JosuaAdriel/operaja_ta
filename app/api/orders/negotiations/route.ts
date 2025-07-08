import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const food_item_id = searchParams.get('food_item_id');
    
    if (!food_item_id) {
      return NextResponse.json({ error: 'food_item_id is required' }, { status: 400 });
    }

    // Get all orders for this food item with user details (pending, confirmed, completed)
    const { rows } = await pool.query(
      `SELECT orders.*, 
        users.name AS user_name, 
        users.avatar AS user_avatar, 
        users.rating AS user_rating,
        users.reviews_count AS user_reviews
      FROM orders
      JOIN users ON orders.user_id = users.id
      WHERE orders.food_item_id = $1 AND orders.status IN ('pending', 'confirmed', 'completed')
      ORDER BY orders.created_at DESC`,
      [food_item_id]
    );

    return NextResponse.json({
      data: rows,
      status: 'success'
    });
  } catch (error) {
    console.error('Error fetching negotiations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch negotiations' },
      { status: 500 }
    );
  }
} 