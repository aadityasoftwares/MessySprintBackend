import prisma from '../../../config/db.js';
import CryptoUtil from '../../../utils/crypto.util.js';
import JwtUtil from '../../../utils/jwt.util.js';
import AppError from '../../../utils/AppError.js';
import { AuthMessages } from '../constants/auth.constants.js';

export class AuthService {
  async register(data, context = {}) {
    const email = data.email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError(AuthMessages.EMAIL_ALREADY_EXISTS, 400);
    }

    // Find default role or create a default 'USER' role
    let role = await prisma.role.findFirst({
      where: { isDefault: true, isActive: true },
    });

    if (!role) {
      role = await prisma.role.findFirst({
        where: { code: 'USER' },
      });
    }

    if (!role) {
      role = await prisma.role.create({
        data: {
          name: 'user',
          displayName: 'User',
          code: 'USER',
          description: 'Standard application user',
          type: 'SYSTEM',
          isSystem: true,
          isDefault: true,
          priority: 10,
        },
      });
    }

    const hashedPassword = await CryptoUtil.hashPassword(data.password);

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          globalRoleId: role.id,
          status: 'ACTIVE',
          authProvider: 'LOCAL',
          termsAcceptedAt: new Date(),
          profile: {
            create: {
              firstName: data.firstName.trim(),
              lastName: data.lastName.trim(),
              displayName: `${data.firstName.trim()} ${data.lastName.trim()}`,
            },
          },
        },
        include: {
          role: true,
          profile: true,
        },
      });

      // Assign default FREE subscription if plan exists
      const defaultPlan = await tx.plan.findFirst({
        where: { isDefault: true, isActive: true },
      });

      if (defaultPlan) {
        await tx.userSubscription.create({
          data: {
            userId: newUser.id,
            planId: defaultPlan.id,
            status: 'ACTIVE',
            startDate: new Date(),
          },
        });
      }

      return newUser;
    });

    // Create session & tokens
    const sessionResult = await this.createSession(user.id, context);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role.code,
        profile: user.profile,
      },
      ...sessionResult,
    };
  }

  async login(data, context = {}) {
    const email = data.email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
        profile: true,
      },
    });

    if (!user || !user.password) {
      throw new AppError(AuthMessages.INVALID_CREDENTIALS, 401);
    }

    if (user.isDeleted || user.status !== 'ACTIVE') {
      throw new AppError(AuthMessages.ACCOUNT_INACTIVE, 403);
    }

    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      throw new AppError(AuthMessages.ACCOUNT_LOCKED, 423);
    }

    const isMatch = await CryptoUtil.comparePassword(data.password, user.password);
    if (!isMatch) {
      const attempts = user.loginAttempts + 1;
      const lockUntil = attempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null;
      await prisma.user.update({
        where: { id: user.id },
        data: {
          loginAttempts: attempts,
          lockedUntil: lockUntil,
        },
      });
      throw new AppError(AuthMessages.INVALID_CREDENTIALS, 401);
    }

    // Reset login attempts and record login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        loginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
        lastLoginIp: context.ipAddress || null,
      },
    });

    const sessionResult = await this.createSession(user.id, context);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role.code,
        profile: user.profile,
      },
      ...sessionResult,
    };
  }

  async refreshToken(rawRefreshToken, context = {}) {
    let payload;
    try {
      payload = JwtUtil.verifyRefreshToken(rawRefreshToken);
    } catch {
      throw new AppError(AuthMessages.INVALID_REFRESH_TOKEN, 401);
    }

    const hashedToken = CryptoUtil.hashToken(rawRefreshToken);
    const session = await prisma.session.findUnique({
      where: { id: payload.sessionId },
      include: {
        user: {
          include: {
            role: true,
            profile: true,
          },
        },
      },
    });

    if (
      !session ||
      session.status !== 'ACTIVE' ||
      session.refreshTokenHash !== hashedToken ||
      new Date(session.expiresAt) < new Date()
    ) {
      throw new AppError(AuthMessages.INVALID_REFRESH_TOKEN, 401);
    }

    // Rotate refresh token
    const newRawRefreshToken = CryptoUtil.generateToken(40);
    const newHashedToken = CryptoUtil.hashToken(newRawRefreshToken);
    const refreshTokenExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await prisma.session.update({
      where: { id: session.id },
      data: {
        refreshTokenHash: newHashedToken,
        refreshTokenVersion: { increment: 1 },
        lastUsedAt: new Date(),
        lastIpAddress: context.ipAddress || session.lastIpAddress,
      },
    });

    const accessToken = JwtUtil.signAccessToken({
      sub: session.userId,
      sessionId: session.id,
      role: session.user.role.code,
    });

    const refreshToken = JwtUtil.signRefreshToken({
      sub: session.userId,
      sessionId: session.id,
      token: newRawRefreshToken,
    });

    return {
      accessToken,
      refreshToken,
      refreshTokenExpiresAt,
      user: {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role.code,
        profile: session.user.profile,
      },
    };
  }

  async logout(sessionId) {
    if (!sessionId) return;
    await prisma.session.updateMany({
      where: { id: sessionId },
      data: {
        status: 'REVOKED',
        revokedAt: new Date(),
        revokedReason: 'User logged out',
      },
    });
  }

  async logoutAll(userId) {
    await prisma.session.updateMany({
      where: { userId, status: 'ACTIVE' },
      data: {
        status: 'REVOKED',
        revokedAt: new Date(),
        revokedReason: 'User logged out all sessions',
      },
    });
  }

  async createSession(userId, context = {}) {
    const rawRefreshToken = CryptoUtil.generateToken(40);
    const refreshTokenHash = CryptoUtil.hashToken(rawRefreshToken);
    const refreshTokenExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const session = await prisma.session.create({
      data: {
        userId,
        type: 'WEB',
        refreshTokenHash,
        status: 'ACTIVE',
        userAgent: context.userAgent || null,
        createdIpAddress: context.ipAddress || null,
        lastIpAddress: context.ipAddress || null,
        expiresAt: refreshTokenExpiresAt,
        lastUsedAt: new Date(),
      },
      include: {
        user: {
          include: { role: true },
        },
      },
    });

    const accessToken = JwtUtil.signAccessToken({
      sub: userId,
      sessionId: session.id,
      role: session.user.role.code,
    });

    const refreshToken = JwtUtil.signRefreshToken({
      sub: userId,
      sessionId: session.id,
      token: rawRefreshToken,
    });

    return {
      sessionId: session.id,
      accessToken,
      refreshToken,
      refreshTokenExpiresAt,
    };
  }
}

export default AuthService;
