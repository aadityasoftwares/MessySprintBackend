import prisma from '../../../config/db.js';
import AppError from '../../../utils/AppError.js';

export class PlanService {
  async getPlans(includeInactive = false) {
    const where = includeInactive ? {} : { isActive: true };

    return prisma.plan.findMany({
      where,
      include: {
        prices: {
          where: includeInactive ? {} : { isActive: true },
          include: { currency: true },
        },
        features: {
          where: includeInactive ? {} : { isEnabled: true },
          include: { feature: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getPlanById(id) {
    const plan = await prisma.plan.findUnique({
      where: { id },
      include: {
        prices: {
          include: { currency: true },
        },
        features: {
          include: { feature: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!plan) {
      throw new AppError('Plan not found', 404);
    }

    return plan;
  }

  async createPlan(data) {
    const {
      name,
      code,
      description,
      type,
      pricingModel,
      trialDays,
      visibility,
      isPopular,
      sortOrder,
      isDefault,
    } = data;

    const existing = await prisma.plan.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (existing) {
      throw new AppError('Plan with this code already exists', 400);
    }

    if (isDefault) {
      await prisma.plan.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }

    return prisma.plan.create({
      data: {
        name,
        code: code.toUpperCase(),
        description,
        type: type || 'PAID',
        pricingModel: pricingModel || 'FLAT_FEE',
        trialDays: trialDays ?? 0,
        visibility: visibility || 'PUBLIC',
        isPopular: isPopular ?? false,
        sortOrder: sortOrder ?? 0,
        isDefault: isDefault ?? false,
      },
    });
  }

  async updatePlan(id, data) {
    const plan = await prisma.plan.findUnique({ where: { id } });
    if (!plan) {
      throw new AppError('Plan not found', 404);
    }

    if (data.isDefault) {
      await prisma.plan.updateMany({
        where: { isDefault: true, NOT: { id } },
        data: { isDefault: false },
      });
    }

    return prisma.plan.update({
      where: { id },
      data,
    });
  }

  async deletePlan(id) {
    const plan = await prisma.plan.findUnique({
      where: { id },
      include: { _count: { select: { subscriptions: true } } },
    });

    if (!plan) {
      throw new AppError('Plan not found', 404);
    }

    if (plan.isSystem) {
      throw new AppError('Cannot delete a system plan', 400);
    }

    if (plan._count.subscriptions > 0) {
      throw new AppError('Cannot delete plan with active or past subscriptions', 400);
    }

    await prisma.plan.delete({ where: { id } });
  }
}

export default PlanService;
