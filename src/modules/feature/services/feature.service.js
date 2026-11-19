import prisma from '../../../config/db.js';
import AppError from '../../../utils/AppError.js';

export class FeatureService {
  async getFeatures(category) {
    const where = {
      ...(category && { category }),
    };

    return prisma.feature.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  async createFeature(data) {
    const { name, code, description, category, type, isDefault } = data;

    const existing = await prisma.feature.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (existing) {
      throw new AppError('Feature with this code already exists', 400);
    }

    return prisma.feature.create({
      data: {
        name,
        code: code.toUpperCase(),
        description,
        category: category || 'GENERAL',
        type: type || 'BOOLEAN',
        isDefault: isDefault ?? false,
      },
    });
  }

  async updateFeature(id, data) {
    const feature = await prisma.feature.findUnique({ where: { id } });
    if (!feature) {
      throw new AppError('Feature not found', 404);
    }

    return prisma.feature.update({
      where: { id },
      data,
    });
  }
}

export default FeatureService;
