import prisma from '../../../config/db.js';
import AppError from '../../../utils/AppError.js';

export class PlanFeatureService {
  async getPlanFeatures(planId) {
    return prisma.planFeature.findMany({
      where: { planId },
      include: {
        feature: true,
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async setPlanFeature(data) {
    const { planId, featureId, isEnabled = true, limit = 0, limitType = 'COUNT', isUnlimited = false, sortOrder } = data;

    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) throw new AppError('Plan not found', 404);

    const feature = await prisma.feature.findUnique({ where: { id: featureId } });
    if (!feature) throw new AppError('Feature not found', 404);

    return prisma.planFeature.upsert({
      where: {
        planId_featureId: {
          planId,
          featureId,
        },
      },
      update: {
        isEnabled,
        limit,
        limitType,
        isUnlimited,
        ...(sortOrder !== undefined && { sortOrder }),
      },
      create: {
        planId,
        featureId,
        isEnabled,
        limit,
        limitType,
        isUnlimited,
        sortOrder: sortOrder ?? 0,
      },
      include: {
        feature: true,
      },
    });
  }

  async removePlanFeature(planId, featureId) {
    return prisma.planFeature.deleteMany({
      where: { planId, featureId },
    });
  }
}

export default PlanFeatureService;
