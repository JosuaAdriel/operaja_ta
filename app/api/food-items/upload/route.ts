import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

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

    // Save file to /public with unique name
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name);
    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const filePath = path.join(process.cwd(), 'public', fileName);
    await fs.writeFile(filePath, buffer);
    const fileUrl = `/${fileName}`;
    return NextResponse.json({ url: fileUrl, status: 'success' });
  } catch (err: any) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Failed to upload image', details: err.message }, { status: 500 });
  }
} 