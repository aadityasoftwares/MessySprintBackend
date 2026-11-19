import prisma from '../../../config/db.js';

export class SubscriptionUsageService {
  async getUsage(userId) {
    return prisma.subscriptionUsage.findMany({
      where: { userId },
      orderBy: { featureCode: 'asc' },
    });
  }

  async incrementUsage(userId, featureCode, amount = 1) {
    return prisma.subscriptionUsage.upsert({
      where: {
        userId_featureCode: {
          userId,
          featureCode,
        },
      },
      update: {
        usedCount: { increment: amount },
        lastCalculatedAt: new Date(),
      },
      create: {
        userId,
        featureCode,
        usedCount: amount,
        lastCalculatedAt: new Date(),
      },
    });
  }

  async setStorageBytes(userId, storageBytes) {
    return prisma.subscriptionUsage.upsert({
      where: {
        userId_featureCode: {
          userId,
          featureCode: 'STORAGE',
        },
      },
      update: {
        storageBytesUsed: BigInt(storageBytes),
        lastCalculatedAt: new Date(),
      },
      create: {
        userId,
        featureCode: 'STORAGE',
        storageBytesUsed: BigInt(storageBytes),
        lastCalculatedAt: new Date(),
      },
    });
  }
}

export default SubscriptionUsageService;
