const loginBtn = document.getElementById('loginBtn');
const userDiv = document.getElementById('user');
const usernameSpan = document.getElementById('username');
const avatarImg = document.getElementById('avatar');

const mainContainer = document.getElementById('main');
const callbackContainer = document.getElementById('callback');
const serverList = document.getElementById('serverList');

// Replace with your actual Discord Client ID
const CLIENT_ID = 'YOUR_CLIENT_ID';
const REDIRECT_URI = encodeURIComponent('https://solbotverify.vercel.app/api/auth/callback');
const SCOPE = 'identify%20guilds';
const DISCORD_AUTH_URL = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=${SCOPE}`;

loginBtn.addEventListener('click', () => {
  window.location.href = DISCORD_AUTH_URL;
});

if (window.location.pathname === '/api/auth/callback') {
  mainContainer.classList.add('hidden');
  callbackContainer.classList.remove('hidden');

  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  const accessToken = params.get('access_token');

  if (accessToken) {
    fetch('https://discord.com/api/users/@me', {
      headers: { authorization: `Bearer ${accessToken}` }
    })
      .then(res => res.json())
      .then(userData => {
        localStorage.setItem('discordUser', JSON.stringify(userData));
        return fetch('/api/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: accessToken })
        });
      })
      .then(res => res.json())
      .then(data => {
        localStorage.setItem('discordGuilds', JSON.stringify(data.guilds));
        window.location.href = '/dashboard.html';
      })
      .catch(err => {
        console.error('❌ Auth failed:', err);
        alert('Authentication failed.');
        window.location.href = '/';
      });
  } else {
    alert('Authentication failed: No token found.');
    window.location.href = '/';
  }
} else {
  const user = JSON.parse(localStorage.getItem('discordUser'));
  if (user) {
    usernameSpan.textContent = `${user.username}#${user.discriminator}`;
    avatarImg.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
    userDiv.classList.remove('hidden');
    loginBtn.style.display = 'none';

    mainContainer.classList.remove('hidden');

    const guilds = JSON.parse(localStorage.getItem('discordGuilds')) || [];

    if (!guilds.length) {
      serverList.innerHTML = '<p>You are not an admin in any servers.</p>';
      return;
    }

    guilds.forEach(guild => {
      const card = document.createElement('div');
      card.className = 'server-card';
      card.innerHTML = `
        <h3>${guild.name}</h3>
        <img src="${guild.iconURL}" alt="Guild Icon" width="64" />
        <p><strong>Manage:</strong> <a href="/dashboard/${guild.id}">Go to Settings</a></p>
      `;
      serverList.appendChild(card);
    });
  } else {
    mainContainer.classList.add('hidden');
  }
}
