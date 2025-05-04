// utils.js
const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(process.cwd(), 'users.json');

let verifiedUsers = [];

try {
  const data = fs.readFileSync(USERS_FILE, 'utf8');
  verifiedUsers = JSON.parse(data) || [];
} catch (err) {
  fs.writeFileSync(USERS_FILE, '[]');
}

function saveVerifiedUsers() {
  fs.writeFileSync(USERS_FILE, JSON.stringify(verifiedUsers, null, 2));
}

function addVerifiedUser(userId, accessToken) {
  const exists = verifiedUsers.some(u => u.userId === userId);
  if (!exists) {
    verifiedUsers.push({ userId, accessToken });
    saveVerifiedUsers();
  }
}

module.exports = { addVerifiedUser, verifiedUsers };
