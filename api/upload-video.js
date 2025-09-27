// File: /api/upload-video.js

import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

// The 'edge' runtime is faster and designed for streaming.
export const config = {
  runtime: 'edge',
};

// The default handler for this serverless function.
export default async function handler(request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return new Response(
      JSON.stringify({ message: 'Missing "filename" query parameter.' }), 
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // The request.body is a readable stream of the file contents.
    // The `put` function streams this directly to the Vercel Blob store.
    const blob = await put(filename, request.body, {
      access: 'public', // This makes the file publicly accessible via its URL.
    });

    // The `blob` object contains the URL and other metadata.
    // We use NextResponse to send a JSON response.
    return NextResponse.json(blob);
  } catch (error) {
    console.error('Upload error:', error);
    return new Response(
      JSON.stringify({ message: 'Error uploading file.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}