import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';

export class CryptoUtil {
  static hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  static generateToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  static async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }
}

export default CryptoUtil;
