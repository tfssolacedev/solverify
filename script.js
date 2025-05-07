const loginBtn = document.getElementById('loginBtn');
const userDiv = document.getElementById('user');
const usernameSpan = document.getElementById('username');
const avatarImg = document.getElementById('avatar');

const mainContainer = document.getElementById('main');
const callbackContainer = document.getElementById('callback');
const serverList = document.getElementById('serverList');

// Replace with your actual Discord Client ID
const CLIENT_ID = '1350876059687714888';
const REDIRECT_URI = encodeURIComponent('https://solbotverify.vercel.app/api/auth/callback');
const SCOPE = 'identify%20guilds'; // Only necessary scopes
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
    // Fetch user data
    fetch('https://discord.com/api/users/@me', {
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    })
      .then((res) => res.json())
      .then((userData) => {
        localStorage.setItem('discordUser', JSON.stringify(userData));

        // Send token + user to backend to verify and get guilds
        return fetch('/api/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ access_token: accessToken, user: userData })
        });
      })
      .then((res) => res.json())
      .then((data) => {
        console.log('✅ Verified user and fetched guilds:', data.guilds);

        // Save guilds and redirect
        localStorage.setItem('discordGuilds', JSON.stringify(data.guilds));
        window.location.href = '/dashboard.html';
      })
      .catch((err) => {
        console.error('❌ Failed to verify user or fetch guilds:', err);
        alert('Authentication failed. Please try again.');
        window.location.href = '/';
      });
  } else {
    alert('Authentication failed: No access token found.');
    window.location.href = '/';
  }
} else {
  const user = JSON.parse(localStorage.getItem('discordUser'));
  if (user) {
    usernameSpan.textContent = `${user.username}#${user.discriminator}`;
    avatarImg.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
    userDiv.classList.remove('hidden');
    loginBtn.style.display = 'none';

    // Show dashboard if already logged in
    mainContainer.classList.remove('hidden');

    // Load guilds from backend
    fetch('/api/guilds')
      .then((res) => res.json())
      .then((guilds) => {
        if (!guilds || guilds.length === 0) {
          serverList.innerHTML = '<p>You are not in any servers where the bot is active.</p>';
          return;
        }

        guilds.forEach((guild) => {
          const card = document.createElement('div');
          card.className = 'server-card';
          card.innerHTML = `
            <h3>${guild.name}</h3>
            <img src="${guild.iconURL}" alt="Guild Icon" width="64" />
            <p><strong>Manage:</strong> <a href="/dashboard/${guild.id}">Go to Settings</a></p>
          `;
          serverList.appendChild(card);
        });
      })
      .catch((err) => {
        console.error('Failed to load guilds:', err);
        serverList.innerHTML = '<p>Failed to load servers.</p>';
      });
  } else {
    mainContainer.classList.add('hidden');
  }
}
