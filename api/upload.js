// File: /api/upload.js
import { handleUpload } from '@vercel/blob/client';
import prisma from '../../lib/prisma'; // Our central Prisma client

/**
 * IMPORTANT: Prisma is not fully compatible with the Vercel Edge Runtime yet.
 * We must use the Node.js runtime for any function that accesses the database.
 */
// export const runtime = 'edge'; // This will NOT work with Prisma
export const config = {
  runtime: 'nodejs', // Use the Node.js runtime instead
};

export default async function POST(request) {
  const body = await request.json();

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // `clientPayload` is a string passed from the frontend containing metadata.
        // We parse it to get the uploader's ID and video details.
        const payload = JSON.parse(clientPayload || '{}');
        const { uploaderId, title } = payload;
        
        if (!uploaderId || !title) {
          throw new Error('Missing uploader ID or title in request.');
        }

        // We construct the full URL of this function to use as the callback.
        const requestUrl = new URL(request.url);
        const callbackUrl = `${requestUrl.origin}/api/upload`;

        return {
          callbackUrl,
          // We'll pass the necessary data to the `onUploadCompleted` step via the tokenPayload.
          tokenPayload: JSON.stringify(payload),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // This server-side callback runs AFTER the upload is physically complete.
        // It's the perfect place to write to our database.
        try {
          console.log('✅ SERVER: Upload complete. Now saving to database...');
          const { uploaderId, title, description } = JSON.parse(tokenPayload);

          // Find the user to ensure they exist before linking the video.
          const user = await prisma.user.findUnique({ where: { id: uploaderId } });
          if (!user) {
            throw new Error(`User with ID ${uploaderId} not found.`);
          }
          
          // Create the video record in our Postgres database via Prisma.
          await prisma.video.create({
            data: {
              title,
              description,
              url: blob.url,
              uploaderId: user.id, // Link to the user who uploaded it.
            },
          });
          console.log(`✅ SERVER: Successfully saved video "${title}" to database.`);
        } catch (error) {
          console.error("SERVER: Error in onUploadCompleted callback:", error);
          // Even if DB write fails, the file is already in blob storage.
          // In a real app, you might add retry logic or a cleanup job here.
        }
      },
    });

    return new Response(JSON.stringify(jsonResponse), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}