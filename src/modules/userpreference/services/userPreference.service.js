import prisma from '../../../config/db.js';

export class UserPreferenceService {
  async getPreferences(userId, category) {
    const where = {
      userId,
      ...(category && { category }),
    };

    return prisma.userPreference.findMany({
      where,
      orderBy: { key: 'asc' },
    });
  }

  async setPreference(userId, { key, value, valueType = 'STRING', category = 'GENERAL' }) {
    const normalizedKey = key.trim().toLowerCase();

    return prisma.userPreference.upsert({
      where: {
        userId_key: {
          userId,
          key: normalizedKey,
        },
      },
      update: {
        value,
        valueType,
        category,
      },
      create: {
        userId,
        key: normalizedKey,
        value,
        valueType,
        category,
      },
    });
  }

  async deletePreference(userId, key) {
    const normalizedKey = key.trim().toLowerCase();

    return prisma.userPreference.deleteMany({
      where: {
        userId,
        key: normalizedKey,
      },
    });
  }
}

export default UserPreferenceService;
