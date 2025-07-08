import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET single food item by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { rows } = await pool.query(`
      SELECT food_items.*, 
        users.name AS provider_name, 
        users.avatar AS provider_avatar, 
        users.rating AS provider_rating, 
        users.reviews_count AS provider_reviews,
        users.bank_name AS provider_bank_name,
        users.account_number AS provider_account_number
      FROM food_items
      JOIN users ON food_items.provider_id = users.id
      WHERE food_items.id = $1
    `, [params.id]);

    if (!(rows as any[]).length) {
      return NextResponse.json(
        { error: 'Food item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: (rows as any[])[0],
      status: 'success'
    });
  } catch (error) {
    console.error('Error fetching food item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch food item' },
      { status: 500 }
    );
  }
}

// PUT update food item
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const {
      name,
      price,
      rating,
      distance,
      availability,
      image_url,
      location_address,
      location_details,
      description_title,
      description_content
    } = body;

    const result = await pool.query(
      `UPDATE food_items SET 
        name = $1, price = $2, rating = $3, distance = $4, availability = $5, image_url = $6,
        location_address = $7, location_details = $8, description_title = $9, description_content = $10
      WHERE id = $11`,
      [
        name, price, rating, distance, availability, image_url,
        location_address, location_details, description_title, description_content,
        params.id
      ]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: 'Food item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Food item updated successfully',
      status: 'success'
    });
  } catch (error) {
    console.error('Error updating food item:', error);
    return NextResponse.json(
      { error: 'Failed to update food item' },
      { status: 500 }
    );
  }
}

// DELETE food item
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await pool.query(
      'DELETE FROM food_items WHERE id = $1',
      [params.id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: 'Food item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Food item deleted successfully',
      status: 'success'
    });
  } catch (error) {
    console.error('Error deleting food item:', error);
    return NextResponse.json(
      { error: 'Failed to delete food item' },
      { status: 500 }
    );
  }
} 