const loginBtn = document.getElementById('loginBtn');
const userDiv = document.getElementById('user');
const usernameSpan = document.getElementById('username');
const avatarImg = document.getElementById('avatar');

const mainContainer = document.getElementById('main');
const callbackContainer = document.getElementById('callback');
const profileData = document.getElementById('profileData');
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
    .then(res => res.json())
    .then(userData => {
      // Display user info
      profileData.innerHTML = `
        <p><strong>Username:</strong> ${userData.username}#${userData.discriminator}</p>
        <p><strong>User ID:</strong> ${userData.id}</p>
        <p><strong>Email:</strong> ${userData.email || "Not available"}</p>
        <img src="https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png" width="100" style="border-radius: 50%; margin-top: 10px;" />
      `;

      localStorage.setItem('discordUser', JSON.stringify(userData));

      // NEW: Send token to backend
      fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ access_token: accessToken })
      })
      .then(res => res.json())
      .then(data => {
        console.log('✅ User verified on backend:', data);
      })
      .catch(err => {
        console.error('❌ Failed to verify user:', err);
      });

      // Server list
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

        window.open(server.invite, '_blank');
      });

      setTimeout(() => {
        window.location.href = '/';
      }, 3000); // Wait 3 seconds before redirecting
    })
    .catch(err => {
      console.error('Error fetching user:', err);
      alert('Failed to fetch user data.');
      window.location.href = '/';
    });
  } else {
    alert('Authentication failed.');
    window.location.href = '/';
  }
} else {
  const user = JSON.parse(localStorage.getItem('discordUser'));
  if (user) {
    usernameSpan.textContent = `${user.username}#${user.discriminator}`;
    avatarImg.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
    userDiv.classList.remove('hidden');
    loginBtn.style.display = 'none';
  }
}
