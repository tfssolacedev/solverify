// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const userDiv = document.getElementById('user');
const usernameSpan = document.getElementById('username');
const avatarImg = document.getElementById('avatar');

const mainContainer = document.getElementById('main');
const callbackContainer = document.getElementById('callback');
const loadingEl = document.getElementById('loading');

// Configuration
const CLIENT_ID = 'YOUR_CLIENT_ID'; // Replace with your Discord Client ID
const REDIRECT_URI = encodeURIComponent('https://solbot.store/api/auth/callback');
const SCOPE = 'identify%20guilds';
const DISCORD_AUTH_URL = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=${SCOPE}`;

// Show loading spinner
function showLoading(message = "Redirecting...") {
  if (loadingEl) {
    loadingEl.textContent = message;
    loadingEl.classList.remove('hidden');
  }
}

// Handle Login Click
if (loginBtn) {
  loginBtn.addEventListener('click', () => {
    window.location.href = DISCORD_AUTH_URL;
  });
}

// Check current path
if (window.location.pathname === '/api/auth/callback') {
  // Hide main content, show callback UI
  if (mainContainer) mainContainer.style.display = 'none';
  if (callbackContainer) callbackContainer.style.display = 'block';
  showLoading("Authenticating...");

  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  const accessToken = params.get('access_token');

  if (!accessToken) {
    alert('Authentication failed: No token found.');
    window.location.href = '/';
    return;
  }

  // Fetch User Info
  fetch('https://discord.com/api/users/@me', {
    headers: { authorization: `Bearer ${accessToken}` },
  })
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch user data');
      return res.json();
    })
    .then(userData => {
      localStorage.setItem('discordUser', JSON.stringify(userData));

      // Send token to backend for verification
      return fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: accessToken }),
      }).then(res => {
        if (!res.ok) throw new Error('Server verification failed');
        return res.json();
      });
    })
    .then(data => {
      localStorage.setItem('discordGuilds', JSON.stringify(data.guilds));
      window.location.href = '/dashboard.html';
    })
    .catch(err => {
      console.error('❌ Auth failed:', err);
      alert('Authentication failed. Please try again.');
      window.location.href = '/';
    });

} else {
  // Main Page Logic
  const storedUser = localStorage.getItem('discordUser');
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (mainContainer) mainContainer.style.display = 'block';

  // Show user info if logged in
  if (user) {
    usernameSpan.textContent = `${user.username}#${user.discriminator}`;
    avatarImg.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
    userDiv.classList.remove('hidden');
    if (loginBtn) loginBtn.style.display = 'none';
  } else {
    if (loginBtn) loginBtn.style.display = 'inline-block';
    userDiv.classList.add('hidden');
  }
}
