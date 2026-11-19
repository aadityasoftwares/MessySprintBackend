import prisma from '../../../config/db.js';
import AppError from '../../../utils/AppError.js';

export class UserService {
  async getUsers({ page = 1, limit = 10, search = '' }) {
    const skip = (page - 1) * limit;
    const where = {
      isDeleted: false,
      ...(search && {
        OR: [
          { email: { contains: search, mode: 'insensitive' } },
          { profile: { firstName: { contains: search, mode: 'insensitive' } } },
          { profile: { lastName: { contains: search, mode: 'insensitive' } } },
        ],
      }),
    };

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          status: true,
          authProvider: true,
          isEmailVerified: true,
          createdAt: true,
          role: true,
          profile: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      users,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserById(id) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        status: true,
        authProvider: true,
        isEmailVerified: true,
        lastLoginAt: true,
        createdAt: true,
        role: true,
        profile: true,
        subscriptions: {
          where: { isActive: true },
          include: { plan: true },
        },
      },
    });

    if (!user || user.isDeleted) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async updateUserStatus(id, status) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user || user.isDeleted) {
      throw new AppError('User not found', 404);
    }

    return prisma.user.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        email: true,
        status: true,
        updatedAt: true,
      },
    });
  }

  async deleteUser(id) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user || user.isDeleted) {
      throw new AppError('User not found', 404);
    }

    await prisma.user.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        status: 'INACTIVE',
      },
    });

    // Revoke all active sessions
    await prisma.session.updateMany({
      where: { userId: id, status: 'ACTIVE' },
      data: { status: 'REVOKED', revokedReason: 'User deleted' },
    });
  }
}

export default UserService;
