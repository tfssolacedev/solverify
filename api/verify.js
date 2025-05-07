export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { access_token } = req.body;

  try {
    // Fetch guilds or verify token via Discord API
    const discordRes = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!discordRes.ok) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const guilds = await discordRes.json();
    return res.status(200).json({ success: true, guilds });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
