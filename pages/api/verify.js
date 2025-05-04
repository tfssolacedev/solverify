// pages/api/verify.js
import { addVerifiedUser } from '../../utils';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { access_token } = req.body;

  if (!access_token) {
    return res.status(400).json({ error: 'Missing access token' });
  }

  try {
    // Fetch user info from Discord
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: {
        authorization: `Bearer ${access_token}`,
      },
    });

    if (!userRes.ok) {
      return res.status(401).json({ error: 'Invalid access token' });
    }

    const userData = await userRes.json();

    // Add user to list
    addVerifiedUser(userData.id, access_token);

    return res.status(200).json({
      success: true,
      userId: userData.id,
      username: `${userData.username}#${userData.discriminator}`,
    });
  } catch (error) {
    console.error('Error verifying user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
