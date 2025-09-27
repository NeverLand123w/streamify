// File: /api/upload.js

import { handleUpload, handleUploadUrl } from '@vercel/blob/client';

export const runtime = 'edge'; // Vercel's Edge Runtime is fast and efficient

export async function POST(request) {
  // `handleUpload` is the Vercel helper that generates the signed URL.
  // It securely communicates with Vercel Blob Storage on your behalf.
  try {
    const jsonResponse = await handleUpload({
      body: await request.json(), // Contains metadata like the filename
      request,
      onBeforeGenerateToken: async (pathname /*, clientPayload */) => {
        // This server-side callback runs before the signed URL is generated.
        // It's the perfect place for validation and security checks.

        // TODO: Add authentication here.
        // For example, check if the user is logged in. If not, throw an error.
        // const { userId } = auth();
        // if (!userId) {
        //   throw new Error('You must be logged in to upload files.');
        // }

        // You can also add metadata to the token that will be available
        // in the `onUploadCompleted` callback.
        return {
          allowedContentTypes: ['video/mp4', 'video/quicktime', 'video/x-matroska', 'video/webm'],
          tokenPayload: JSON.stringify({
            // This is a great place to add any data you want to associate
            // with the upload, like the user's ID.
            // userId: userId, 
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // This server-side callback runs AFTER the file has been successfully uploaded
        // to Vercel Blob Storage. The client's browser does not wait for this.

        console.log('✅ Upload complete!', blob);
        // `blob` contains the final URL and other details.
        // `tokenPayload` contains the metadata we added in `onBeforeGenerateToken`.
        
        // TODO: Save the blob details to your database.
        // Now is the time to write the blob.url to your user's record or a videos table.
        // Example:
        // const { userId } = JSON.parse(tokenPayload);
        // await db.videos.create({ data: { userId, url: blob.url, pathname: blob.pathname } });
      },
    });

    // The `jsonResponse` is sent back to the client's browser.
    // It contains the signed URL and other data needed for the direct upload.
    return new Response(JSON.stringify(jsonResponse), { status: 200 });

  } catch (error) {
    // If anything goes wrong (e.g., auth fails), an error is returned.
    return new Response(
      JSON.stringify({ error: error.message || "Failed to handle upload." }),
      { status: 400 } // Bad Request
    );
  }
}