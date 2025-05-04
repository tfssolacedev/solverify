const loginBtn = document.getElementById('loginBtn');
const userDiv = document.getElementById('user');
const usernameSpan = document.getElementById('username');
const serverList = document.getElementById('serverList');

// Replace with your actual Discord Client ID
const CLIENT_ID = '1350876059687714888';
const REDIRECT_URI = encodeURIComponent('https://solbotverify.vercel.app/api/auth/callback');
const SCOPE = 'identify%20email%20guilds.join';
const DISCORD_AUTH_URL = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=${SCOPE}`;

loginBtn.addEventListener('click', () => {
  window.location.href = DISCORD_AUTH_URL;
});

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
    .then(userData => {
      localStorage.setItem('discordUser', JSON.stringify(userData));

      // Server list with invite links
      const servers = [
        { name: "SolBot", invite: "https://discord.gg/solbot" },
        { name: "Caught Wiki", invite: "https://discord.gg/caughtwiki" },
        { name: "Support Server", invite: "https://discord.gg/7Hy3hztkJE" }
      ];

      // Open each invite in a new tab
      servers.forEach(server => {
        const li = document.createElement("li");
        li.textContent = `Joining ${server.name}...`;
        serverList.appendChild(li);

        window.open(server.invite, '_blank'); // Opens invite in new tab
      });

      setTimeout(() => {
        window.location.href = '/';
      }, 3000); // Wait before redirecting

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
    userDiv.classList.remove('hidden');
    loginBtn.style.display = 'none';
  }
}
