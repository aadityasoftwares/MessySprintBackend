import JwtUtil from '../utils/jwt.util.js';
import ResponseUtil from '../utils/response.util.js';
import prisma from '../config/db.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(ResponseUtil.unauthorized('Unauthorized: No token provided'));
    }

    const token = authHeader.substring(7).trim();
    if (!token) {
      return res.status(401).json(ResponseUtil.unauthorized('Unauthorized: No token provided'));
    }

    let payload;
    try {
      payload = JwtUtil.verifyAccessToken(token);
    } catch {
      return res.status(401).json(ResponseUtil.unauthorized('Unauthorized: Invalid or expired access token'));
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        role: true,
        profile: true,
      },
    });

    if (!user || user.isDeleted || user.status !== 'ACTIVE') {
      return res.status(401).json(ResponseUtil.unauthorized('Unauthorized: User not found or inactive'));
    }

    if (payload.sessionId) {
      const session = await prisma.session.findUnique({
        where: { id: payload.sessionId },
      });

      if (!session || session.status !== 'ACTIVE' || new Date(session.expiresAt) < new Date()) {
        return res.status(401).json(ResponseUtil.unauthorized('Unauthorized: Session revoked or expired'));
      }

      req.session = session;
    }

    req.user = user;
    return next();
  } catch (error) {
    console.error('AuthMiddleware Error:', error);
    return res.status(500).json(ResponseUtil.serverError('Internal server error during authentication', error.message));
  }
};

export default authMiddleware;
