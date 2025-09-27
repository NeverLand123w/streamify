// File: /api/upload-video.js
const { put } = require('@vercel/blob');

// This handler uses the Node.js runtime by default, which is more stable for local development (`vercel dev`).
// Vercel's production environment will also handle this runtime perfectly.
async function handler(request, response) {
  // `request.query` contains the query parameters from the URL (e.g., ?filename=...)
  const filename = request.query.filename;

  if (!filename) {
    // If filename is missing, send a 400 Bad Request error.
    return response.status(400).json({ message: 'Missing "filename" query parameter.' });
  }

  // `request.body` is the raw stream of the file being uploaded.
  try {
    const blob = await put(filename, request.body, {
      access: 'public', // Make the uploaded file publicly accessible.
    });

    // On success, send back the blob object from Vercel.
    return response.status(200).json(blob);

  } catch (error) {
    console.error('Upload to Vercel Blob failed:', error);
    // If an error occurs during upload, send a 500 Internal Server Error.
    return response.status(500).json({ message: 'Error uploading file.' });
  }
}

module.exports = handler;