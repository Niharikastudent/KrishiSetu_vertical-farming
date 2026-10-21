const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { col, DIR } = require('./db');

const SECRET_FILE = path.join(DIR, '.secret');
let JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  if (!fs.existsSync(SECRET_FILE)) fs.writeFileSync(SECRET_FILE, crypto.randomBytes(48).toString('hex'));
  JWT_SECRET = fs.readFileSync(SECRET_FILE, 'utf8');
}

const users = col('users');
const sign = (user) => jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '30d' });

function userFromToken(token) {
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    return users.rows.find((u) => u.id === id) || null;
  } catch {
    return null;
  }
}

function auth(req, res, next) {
  const user = userFromToken((req.headers.authorization || '').replace('Bearer ', ''));
  if (!user) return res.status(401).json({ error: 'Session expired. Please log in again.' });
  req.user = user;
  next();
}

module.exports = { sign, auth, userFromToken, users };
