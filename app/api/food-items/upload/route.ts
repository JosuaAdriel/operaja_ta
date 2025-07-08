import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Only accept multipart form data
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.startsWith('multipart/form-data')) {
      return NextResponse.json({ error: 'Content-Type must be multipart/form-data' }, { status: 400 });
    }

    // Parse the form data
    const formData = await req.formData();
    const file = formData.get('file');
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Upload file to Supabase Storage
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const { data, error } = await supabase.storage
      .from('uploads') // pastikan ada bucket 'uploads' di Supabase Storage
      .upload(fileName, buffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: true,
      });
    if (error) {
      return NextResponse.json({ error: 'Failed to upload image', details: error.message }, { status: 500 });
    }
    const fileUrl = `${supabaseUrl}/storage/v1/object/public/uploads/${fileName}`;
    return NextResponse.json({ url: fileUrl, status: 'success' });
  } catch (err: any) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Failed to upload image', details: err.message }, { status: 500 });
  }
} 