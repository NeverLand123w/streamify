// File: /api/upload.js
import { handleUpload } from '@vercel/blob/client';

export const runtime = 'edge';

export async function POST(request) {
  // Our token check is working, so we can remove this line for clean code.
  // console.log('SERVER-SIDE TOKEN CHECK:', { hasToken: !!process.env.BLOB_READ_WRITE_TOKEN });
  
  const body = await request.json(); // Read the body just once.

  try {
    const jsonResponse = await handleUpload({
      body, // Pass the parsed body.
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => { // Accept the clientPayload parameter.
        // The bug workaround: The SDK seems to require the 'clientPayload' even if it's not strictly used.
        // We will return it, along with our other settings.
        console.log(`Generating token for ${pathname} with payload: ${clientPayload}`);

        return {
          allowedContentTypes: ['video/mp4', 'video/quicktime', 'video/webm'],
          // MUST pass the clientPayload through if you accept it.
          clientPayload, 
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log('✅ Server callback: Upload complete!', blob);
        // Save blob.url to your database here.
      },
    });

    return new Response(JSON.stringify(jsonResponse), { status: 200 });
  } catch (error) {
    console.error("SERVER ERROR:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to handle upload." }),
      { status: 400 }
    );
  }
}