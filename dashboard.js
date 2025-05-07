document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('guilds-container');
  const guilds = JSON.parse(localStorage.getItem('discordGuilds')) || [];

  if (!guilds.length) {
    container.innerHTML = `<p>You are not an admin in any servers.</p>`;
    return;
  }

  guilds.forEach(guild => {
    const iconURL = guild.icon
      ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
      : 'https://cdn.discordapp.com/embed/avatars/1.png';

    const card = document.createElement('div');
    card.className = 'server-card';
    card.innerHTML = `
      <img src="${iconURL}" alt="Guild Icon" />
      <div class="guild-info">
        <strong>${guild.name}</strong>
        <br/>
        <small>Guild ID: ${guild.id}</small>
      </div>
      <button onclick="openConfig('${guild.id}', '${guild.name}')">Config</button>
    `;
    container.appendChild(card);
  });
});

function openConfig(guildId, guildName) {
  alert(`Opening config for ${guildName} (ID: ${guildId})`);
}
