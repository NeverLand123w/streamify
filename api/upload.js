import { handleUpload } from '@vercel/blob';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const body = await req.json();
  const result = await handleUpload({
    body,
    request: req,
    onBeforeGenerateToken: async () => ({
      allowedContentTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
    }),
  });

  return new Response(JSON.stringify(result), { status: 200 });
}
