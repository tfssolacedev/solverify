app.post('/api/verify', async (req, res) => {
  const { access_token } = req.body;

  try {
    const guildRes = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: { authorization: `Bearer ${access_token}` },
    });

    const guilds = await guildRes.json();

    // Filter only guilds where user has MANAGE_GUILD permission
    const adminGuilds = guilds.filter(g =>
      (g.permissions & 0x20) === 0x20
    );

    res.json({ guilds: adminGuilds });
  } catch (err) {
    res.status(500).json({ error: 'Failed to verify token' });
  }
});
