const axios = require('axios');

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'Code is required' });
  }

  try {
    const response = await axios.post('https://discord.com/api/oauth2/token', null, {
      params: {
        client_id: '1338188377559666730', // Replace with your Discord Client ID
        client_secret: process.env.DISCORD_CLIENT_SECRET, // Store this in your environment variables
        grant_type: 'authorization_code',
        code,
        redirect_uri: encodeURIComponent('https://solbot.store/api/auth/callback'),
        scope: 'identify guilds email guilds.members.read'
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token } = response.data;
    return res.status(200).json({ access_token });
  } catch (error) {
    console.error('Failed to exchange code for token:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
