// dashboard.js

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('guilds-container');

  // Get user & guilds from localStorage
  const user = JSON.parse(localStorage.getItem('discordUser'));
  const guilds = JSON.parse(localStorage.getItem('discordGuilds'));

  if (!user || !guilds) {
    container.innerHTML = '<p class="no-servers">You are not logged in or no servers found.</p>';
    return;
  }

  // Filter only guilds where user has Administrator
  const adminGuilds = guilds.filter(guild => {
    const permissions = parseInt(guild.permissions ?? 0);
    return (permissions & 0x8) === 0x8; // Check for ADMINISTRATOR bit
  });

  if (adminGuilds.length === 0) {
    container.innerHTML = '<p class="no-servers">You do not have Administrator permissions in any servers.</p>';
    return;
  }

  adminGuilds.forEach(guild => {
    const card = document.createElement('div');
    card.className = 'server-card';

    const iconURL = guild.icon
      ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
      : 'https://cdn.discordapp.com/embed/avatars/1.png';

    card.innerHTML = `
      <div class="server-info">
        <img src="${iconURL}" alt="Guild Icon" />
        <div>
          <h3>${guild.name}</h3>
          <small>Guild ID: ${guild.id}</small>
        </div>
      </div>
      <button class="config-btn" onclick="openConfig('${guild.id}', '${guild.name}')">Config</button>
    `;

    container.appendChild(card);
  });
});

// Placeholder for config button click
function openConfig(guildId, guildName) {
  alert(`Opening config for ${guildName} (ID: ${guildId})`);
}
