import prisma from '../../../config/db.js';
import AppError from '../../../utils/AppError.js';

export class SystemSettingService {
  async getSettings(isPublicOnly = false, category) {
    const where = {
      ...(isPublicOnly && { isPublic: true }),
      ...(category && { category }),
    };

    return prisma.systemSetting.findMany({
      where,
      orderBy: { key: 'asc' },
    });
  }

  async getSettingByKey(key) {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: key.toUpperCase() },
    });

    if (!setting) {
      throw new AppError('Setting not found', 404);
    }

    return setting;
  }

  async setSetting(data) {
    const { key, value, valueType = 'STRING', category = 'GENERAL', description = '', defaultValue, isEditable = true, isPublic = false } = data;

    const normalizedKey = key.toUpperCase().trim();

    return prisma.systemSetting.upsert({
      where: { key: normalizedKey },
      update: {
        value,
        valueType,
        category,
        description,
        isEditable,
        isPublic,
      },
      create: {
        key: normalizedKey,
        value,
        valueType,
        category,
        description,
        defaultValue,
        isEditable,
        isPublic,
      },
    });
  }
}

export default SystemSettingService;
