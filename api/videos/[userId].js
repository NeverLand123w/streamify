// File: /api/videos/[userId].js

import prisma from '../../lib/prisma';

// --- ADD THIS CONFIGURATION OBJECT ---
export const config = {
  runtime: 'nodejs', // Crucial for Prisma
};
// ------------------------------------

export default async function handler(req, res) {
  // ... the rest of your function code is correct ...
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  const { userId } = req.query;

  try {
    const videos = await prisma.video.findMany({
      where: {
        uploaderId: userId,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        uploader: {
          select: { channelName: true, profilePicture: true },
        },
      },
    });
    return res.status(200).json(videos);
  } catch (error) {
    console.error(`Failed to fetch videos for user ${userId}:`, error);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
}