import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const provider_id = searchParams.get('provider_id');
    if (!provider_id) {
      return NextResponse.json({ error: 'provider_id is required' }, { status: 400 });
    }
    const { rows } = await pool.query(
      `SELECT f.*, 
        CASE WHEN EXISTS (
          SELECT 1 FROM orders o 
          WHERE o.food_item_id = f.id AND o.status = 'pending'
        ) THEN 1 ELSE 0 END as has_pending_negotiations
       FROM food_items f 
       WHERE f.provider_id = $1 
       ORDER BY f.created_at DESC`,
      [provider_id]
    );
    return NextResponse.json({ data: rows, status: 'success' });
  } catch (error) {
    console.error('Error fetching my food items:', error);
    return NextResponse.json({ error: 'Failed to fetch food items' }, { status: 500 });
  }
} 