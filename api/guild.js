export default async function handler(req, res) {
  const { guildId } = req.query;

  if (req.method === 'POST') {
    const { disableCommands } = req.body;

    console.log(`Toggling commands for guild ${guildId}:`, disableCommands);

    res.status(200).json({
      success: true,
      guildId,
      disabled: disableCommands
    });
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
