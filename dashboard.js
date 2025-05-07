const storedUser = localStorage.getItem("discordUser");
if (!storedUser) {
  window.location.href = "/";
} else {
  const user = JSON.parse(storedUser);
  document.getElementById("username").textContent = `${user.username}#${user.discriminator}`;
  document.getElementById("avatar").src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
}
