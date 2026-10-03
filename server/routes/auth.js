import { Router } from 'express';
import { scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import { verifyToken } from '../auth/authMiddleware.js';

const router = Router();
const scrypt = promisify(scryptCallback);
const tokenLifetime = process.env.JWT_EXPIRES_IN || '8h';

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is required to authenticate API requests.');
  return secret;
}

async function verifyPassword(password, passwordHash) {
  if (passwordHash.startsWith('scrypt:')) {
    const [, salt, expectedHex] = passwordHash.split(':');
    if (!salt || !/^[\da-f]+$/i.test(expectedHex || '') || expectedHex.length % 2 !== 0) return false;
    const expected = Buffer.from(expectedHex, 'hex');
    const actual = Buffer.from(await scrypt(password, salt, expected.length));
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  }
  return bcrypt.compare(password, passwordHash);
}

function validPassword(password) {
  return typeof password === 'string'
    && password.length >= 8
    && /[a-z]/.test(password)
    && /[A-Z]/.test(password)
    && /\d/.test(password)
    && /[^A-Za-z0-9]/.test(password);
}

router.post('/login', async (request, response) => {
  const { username, password } = request.body || {};
  if (typeof username !== 'string' || typeof password !== 'string') {
    response.status(401).json({ error: 'Invalid credentials.' });
    return;
  }
  const result = await pool.query(
    `SELECT id, username, password_hash, role, branch_id
    FROM users WHERE username = $1 AND is_deleted = false`,
    [username],
  );
  const user = result.rows[0];
  if (!user || !await verifyPassword(password, user.password_hash)) {
    response.status(401).json({ error: 'Invalid credentials.' });
    return;
  }

  if (user.password_hash.startsWith('scrypt:')) {
    const passwordHash = await bcrypt.hash(password, 12);
    await pool.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [passwordHash, user.id]);
  }

  const tokenUser = {
    id: user.id,
    username: user.username,
    role: user.role,
    branch_id: user.branch_id,
  };
  const token = jwt.sign(tokenUser, getJwtSecret(), { expiresIn: tokenLifetime });
  response.json({ token, user: tokenUser });
});

router.post('/logout', (_request, response) => {
  response.json({ success: true });
});

router.get('/me', verifyToken, (request, response) => {
  response.json(request.user);
});

router.post('/change-password', verifyToken, async (request, response) => {
  const { currentPassword, newPassword } = request.body || {};
  if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
    response.status(400).json({ error: 'Current and new passwords are required.' });
    return;
  }
  if (!validPassword(newPassword)) {
    response.status(400).json({
      error: 'New password must be at least 8 characters and include uppercase, lowercase, number, and special character.',
    });
    return;
  }
  const result = await pool.query(
    'SELECT password_hash FROM users WHERE id = $1 AND is_deleted = false',
    [request.user.id],
  );
  const currentHash = result.rows[0]?.password_hash;
  if (!currentHash || !await verifyPassword(currentPassword, currentHash)) {
    response.status(400).json({ error: 'Current password is incorrect.' });
    return;
  }
  const passwordHash = await bcrypt.hash(newPassword, 12);
  await pool.query(
    'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
    [passwordHash, request.user.id],
  );
  response.json({ success: true });
});

export default router;
