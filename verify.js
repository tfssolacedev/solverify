export default async function handler(req, res) {
  try {
    const { access_token } = req.body;

    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { authorization: `Bearer ${access_token}` }
    });

    const guildsRes = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: { authorization: `Bearer ${access_token}` }
    });

    const guilds = await guildsRes.json();

    const adminGuilds = guilds
      .filter(g => (parseInt(g.permissions) & 0x8) === 0x8)
      .map(g => ({
        ...g,
        iconURL: g.icon
          ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`
          : 'https://cdn.discordapp.com/embed/avatars/1.png'
      }));

    res.status(200).json({ success: true, guilds: adminGuilds });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
