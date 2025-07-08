import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET all food items
export async function GET() {
  try {
    const { rows } = await pool.query(`
      SELECT food_items.*, 
        users.name AS provider_name, 
        users.avatar AS provider_avatar, 
        users.rating AS provider_rating, 
        users.reviews_count AS provider_reviews
      FROM food_items
      JOIN users ON food_items.provider_id = users.id
      WHERE food_items.status = 'available'
      ORDER BY food_items.created_at DESC
    `);
    return NextResponse.json({
      data: rows,
      status: 'success'
    });
  } catch (error) {
    console.error('Error fetching food items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch food items' },
      { status: 500 }
    );
  }
}

// POST new food item
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      distance,
      availability,
      image_url,
      location_address,
      location_details,
      provider_id,
      description_title,
      description_content,
      price_patungan,
      weight,
      type = 'donasi' // default to donasi if not specified
    } = body;

    const result = await pool.query(
      `INSERT INTO food_items (
        name, distance, availability, image_url, location_address, location_details, provider_id, description_title, description_content, price_patungan, weight, type
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`,
      [
        name,
        distance,
        availability,
        image_url,
        location_address,
        location_details,
        provider_id,
        description_title,
        description_content,
        price_patungan,
        weight,
        type
      ]
    );

    return NextResponse.json({
      message: 'Food item created successfully',
      id: result.rows[0].id,
      status: 'success'
    });
  } catch (error) {
    console.error('Error creating food item:', error);
    return NextResponse.json(
      { error: 'Failed to create food item', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 