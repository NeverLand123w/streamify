// This file runs on Vercel's serverless Edge runtime
import { handleUpload } from '@vercel/blob';

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  try {
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    const body = await request.json();
    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ['video/mp4', 'video/quicktime', 'video/webm'],
      }),
    });

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate upload URL' }),
      { status: 400 }
    );
  }
}
