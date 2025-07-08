import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST() {
  try {
    // Add order_amount column to orders table if it doesn't exist
    await pool.execute(`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS order_amount DECIMAL(10,2) DEFAULT NULL
    `);
    
    console.log('Migration completed successfully!');
    return NextResponse.json({
      message: 'Migration completed successfully!',
      status: 'success'
    });
  } catch (error) {
    console.error('Migration failed:', error);
    return NextResponse.json(
      { error: 'Migration failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 