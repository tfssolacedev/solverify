document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('guilds-container');
  const guilds = JSON.parse(localStorage.getItem('discordGuilds')) || [];

  if (!guilds.length) {
    container.innerHTML = `<p>You are not an admin in any servers.</p>`;
    return;
  }

  guilds.forEach(guild => {
    const card = document.createElement('div');
    card.className = 'server-card';
    card.innerHTML = `
      <h3>${guild.name}</h3>
      <img src="${guild.iconURL}" alt="Guild Icon" width="64" />
      <p><strong>Config:</strong> <button class="config-btn" onclick="toggleCommands('${guild.id}')">Disable Commands</button></p>
    `;
    container.appendChild(card);
  });
});

function toggleCommands(guildId) {
  fetch(`/api/guilds/${guildId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ disableCommands: true })
  })
  .then(res => res.json())
  .then(data => {
    alert(`Commands disabled for ${guildId}: ${data.success}`);
  })
  .catch(err => {
    console.error(err);
    alert('Failed to update settings.');
  });
}
