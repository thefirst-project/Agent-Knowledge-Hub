import jwt from 'jsonwebtoken';

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is required to authenticate API requests.');
  return secret;
}

export function verifyToken(request, response, next) {
  const authorization = request.get('Authorization') || '';
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    response.status(401).json({ error: 'Authentication is required.' });
    return;
  }

  try {
    const payload = jwt.verify(match[1], getJwtSecret());
    if (!payload || typeof payload !== 'object'
      || !Number.isSafeInteger(payload.id)
      || typeof payload.username !== 'string'
      || typeof payload.role !== 'string') {
      response.status(401).json({ error: 'Invalid or expired token.' });
      return;
    }
    request.user = {
      id: payload.id,
      username: payload.username,
      role: payload.role,
      branch_id: Number.isSafeInteger(payload.branch_id) ? payload.branch_id : null,
    };
    next();
  } catch (error) {
    if (error.message === 'JWT_SECRET is required to authenticate API requests.') {
      next(error);
      return;
    }
    response.status(401).json({ error: 'Invalid or expired token.' });
  }
}

export function requireSuperAdmin(request, response, next) {
  if (request.user?.role !== 'superadmin') {
    response.status(403).json({ error: 'Superadmin access is required.' });
    return;
  }
  next();
}
