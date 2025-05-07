export default async function handler(req, res) {
  const { guildId } = req.query;

  if (req.method === 'POST') {
    const { disableCommands } = req.body;

    // In real app, store this in DB or config file
    console.log(`Command toggled for guild ${guildId}:`, disableCommands);

    res.status(200).json({ success: true, guildId, disabled: disableCommands });
  } else {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
}
