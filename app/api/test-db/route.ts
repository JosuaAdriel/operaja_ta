import { NextResponse } from 'next/server';
import { testConnection, initializeDatabase } from '@/lib/db';

export async function GET() {
  try {
    // Test connection
    const isConnected = await testConnection();
    
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Initialize database and tables
    const isInitialized = await initializeDatabase();
    
    if (!isInitialized) {
      return NextResponse.json(
        { error: 'Database initialization failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Database connected and initialized successfully!',
      status: 'success'
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 