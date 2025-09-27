// File: /api/videos/index.js

import prisma from '../../lib/prisma';

// --- ADD THIS CONFIGURATION OBJECT ---
export const config = {
  runtime: 'nodejs', // This is crucial for Prisma to work
};
// ------------------------------------

export default async function handler(req, res) {
  // ... the rest of your function code is correct and does not need to change ...
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  try {
    const videos = await prisma.video.findMany({
      include: {
        uploader: {
          select: { channelName: true, profilePicture: true, id: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json(videos);
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
}