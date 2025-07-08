import { NextResponse } from 'next/server';
import { seedFoodItems } from '@/lib/seed-data';

export async function POST() {
  try {
    const success = await seedFoodItems();
    
    if (success) {
      return NextResponse.json({
        message: 'Database seeded successfully!',
        status: 'success'
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to seed database' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 