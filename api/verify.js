export default async function handler(req, res) {
  try {
    const { access_token } = req.body;

    const guildsRes = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: { authorization: `Bearer ${access_token}` }
    });

    const guilds = await guildsRes.json();

    const adminGuilds = guilds
      .filter(guild => {
        const permissions = parseInt(guild.permissions ?? 0);
        return (permissions & 0x8) === 0x8;
      })
      .map(guild => ({
        ...guild,
        iconURL: guild.icon
          ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
          : 'https://cdn.discordapp.com/embed/avatars/1.png'
      }));

    res.status(200).json({ success: true, guilds: adminGuilds });
  } catch (error) {
    console.error('Error fetching guilds:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
