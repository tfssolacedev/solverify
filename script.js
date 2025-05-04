const loginBtn = document.getElementById('loginBtn');
const userDiv = document.getElementById('user');
const usernameSpan = document.getElementById('username');
const avatarImg = document.getElementById('avatar');

// Replace with your actual Discord Client ID
const CLIENT_ID = '1350876059687714888';
const REDIRECT_URI = encodeURIComponent('https://solbotverify.vercel.app/api/auth/callback');
const SCOPE = 'identify';
const DISCORD_AUTH_URL = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=${SCOPE}`;

loginBtn.addEventListener('click', () => {
  window.location.href = DISCORD_AUTH_URL;
});

// On callback page, extract token from URL
if (window.location.pathname === '/api/auth/callback') {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  const accessToken = params.get('access_token');

  if (accessToken) {
    fetch('https://discord.com/api/users/@me', {
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    })
    .then(res => res.json())
    .then(data => {
      localStorage.setItem('discordUser', JSON.stringify(data));
      window.location.href = '/';
    })
    .catch(console.error);
  } else {
    alert('Authentication failed.');
    window.location.href = '/';
  }
} else {
  const user = JSON.parse(localStorage.getItem('discordUser'));
  if (user) {
    usernameSpan.textContent = user.username;
    avatarImg.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
    userDiv.classList.remove('hidden');
    loginBtn.style.display = 'none';
  }
}
