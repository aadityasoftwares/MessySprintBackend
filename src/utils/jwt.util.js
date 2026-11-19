import jwt from 'jsonwebtoken';
import env from '../config/env.js';

export class JwtUtil {
  static signAccessToken(payload, expiresIn = env.JWT_EXPIRES_IN) {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn });
  }

  static signRefreshToken(payload, expiresIn = env.JWT_REFRESH_EXPIRES_IN) {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn });
  }

  static verifyAccessToken(token) {
    return jwt.verify(token, env.JWT_ACCESS_SECRET);
  }

  static verifyRefreshToken(token) {
    return jwt.verify(token, env.JWT_REFRESH_SECRET);
  }

  static verifyAccessTokenIgnoreExpiration(token) {
    return jwt.verify(token, env.JWT_ACCESS_SECRET, { ignoreExpiration: true });
  }
}

export default JwtUtil;
