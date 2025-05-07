export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { access_token } = req.body;

  if (!access_token) {
    return res.status(400).json({ error: "Access token missing" });
  }

  try {
    // Fetch user guilds
    const guildsResponse = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!guildsResponse.ok) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const guilds = await guildsResponse.json();

    return res.status(200).json({ success: true, guilds });
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
