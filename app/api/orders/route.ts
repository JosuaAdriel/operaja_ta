import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { food_item_id, user_id, pickup_time, pickup_location, order_amount } = body;

    // 1. Ambil data makanan
    const { rows: foods } = await pool.query(
      'SELECT * FROM food_items WHERE id = $1 AND status = $2',
      [food_item_id, 'available']
    );
    if ((foods as any[]).length === 0) {
      return NextResponse.json({ error: 'Makanan tidak tersedia.' }, { status: 400 });
    }
    const food = (foods as any[])[0];

    // 2. Cek user ≠ provider
    if (food.provider_id === user_id) {
      return NextResponse.json({ error: 'Tidak bisa memesan makanan sendiri.' }, { status: 400 });
    }

    // 3. Parse price_patungan to number for comparison
    // Remove dots and convert to number (e.g., "8.000" -> 8000)
    const minimumPrice = parseFloat(food.price_patungan.replace(/\./g, '')) || 0;
    const offeredAmount = parseFloat(order_amount) || 0;

    // 4. Tentukan status order dan food
    let orderStatus = 'pending';
    let foodStatus = 'available';
    let message = 'Negosiasi berhasil dikirim! Menunggu persetujuan dari donatur.';
    let isNegotiation = true;

    if (offeredAmount >= minimumPrice) {
      orderStatus = 'confirmed';
      foodStatus = 'ordered';
      message = 'Pesanan berhasil dibuat!';
      isNegotiation = false;
    }

    // Tambahan: Cek tipe food item
    if (food.type === 'jualan') {
      // Untuk tipe jualan, order harus langsung confirmed, tidak boleh pending/negosiasi
      const { rows: existingOrder } = await pool.query(
        'SELECT * FROM orders WHERE food_item_id = $1 AND status IN ($2, $3, $4)',
        [food_item_id, 'pending', 'confirmed', 'approved']
      );
      if ((existingOrder as any[]).length > 0) {
        return NextResponse.json({ error: 'Makanan sudah dipesan atau sedang diproses.' }, { status: 400 });
      }
      // Insert order langsung confirmed
      const result = await pool.query(
        'INSERT INTO orders (food_item_id, user_id, order_amount, status) VALUES ($1, $2, $3, $4) RETURNING id',
        [food_item_id, user_id, food.price_patungan, 'confirmed']
      );
      await pool.query(
        'UPDATE food_items SET status = $1 WHERE id = $2',
        ['ordered', food_item_id]
      );
      // Update total penghematan dan sampah yang diselamatkan untuk user
      const savingsAmount = parseFloat(food.price_patungan) * 2;
      const wasteSaved = food.weight || 0;
      await pool.query(
        'UPDATE users SET total_savings = total_savings + $1, total_waste_saved = total_waste_saved + $2 WHERE id = $3',
        [savingsAmount, wasteSaved, user_id]
      );
      return NextResponse.json({
        message: 'Pesanan jualan berhasil dibuat!',
        data: {
          id: result.rows[0].id,
          food_item_id,
          user_id,
          order_amount: food.price_patungan,
          status: 'confirmed'
        },
        status: 'success',
        order_status: 'confirmed',
        is_negotiation: false
      });
    }

    // 5. Insert ke orders
    const result = await pool.query(
      'INSERT INTO orders (food_item_id, user_id, order_amount, status) VALUES ($1, $2, $3, $4) RETURNING id',
      [food_item_id, user_id, order_amount, orderStatus]
    );

    // 6. Update status makanan jika order confirmed
    if (orderStatus === 'confirmed') {
      await pool.query(
        'UPDATE food_items SET status = $1 WHERE id = $2',
        ['ordered', food_item_id]
      );

      // 7. Update total penghematan dan sampah yang diselamatkan untuk user
      const savingsAmount = parseFloat(order_amount) * 2; // price_patungan * 2
      const wasteSaved = food.weight || 0; // weight makanan

      await pool.query(
        'UPDATE users SET total_savings = total_savings + $1, total_waste_saved = total_waste_saved + $2 WHERE id = $3',
        [savingsAmount, wasteSaved, user_id]
      );
    }

    return NextResponse.json({
      message: message,
      data: {
        id: result.rows[0].id,
        food_item_id,
        user_id,
        order_amount,
        status: orderStatus
      },
      status: 'success',
      order_status: orderStatus,
      is_negotiation: isNegotiation
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Gagal membuat pesanan', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 