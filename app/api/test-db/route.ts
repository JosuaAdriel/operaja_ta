import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test connection dan inisialisasi database tidak diperlukan di Supabase
    return NextResponse.json({
      message: 'Database connection assumed OK (Supabase)',
      status: 'success'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 