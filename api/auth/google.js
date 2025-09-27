// File: /api/auth/google.js
import prisma from '../../lib/prisma';

// --- ADD THIS CONFIGURATION OBJECT ---
export const config = {
  runtime: 'nodejs', // Crucial for Prisma
};
// ------------------------------------

export default async function handler(req, res) {
  // ... rest of your function code is correct ...
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  try {
    const { googleId, email, name, picture } = req.body;
    const user = await prisma.user.upsert({
      where: { googleId },
      update: {},
      create: {
        googleId,
        email,
        channelName: name,
        profilePicture: picture,
      },
    });
    return res.status(200).json({ user });
  } catch (error) {
    console.error('Error in Google auth handler:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}