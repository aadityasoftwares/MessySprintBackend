import prisma from '../../../config/db.js';
import AppError from '../../../utils/AppError.js';

export class PlanPriceService {
  async getPlanPrices(planId) {
    const where = {
      ...(planId && { planId }),
    };

    return prisma.planPrice.findMany({
      where,
      include: {
        plan: true,
        currency: true,
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async createPlanPrice(data) {
    const { planId, currencyId, billingInterval, amountMinor, sortOrder } = data;

    const existing = await prisma.planPrice.findUnique({
      where: {
        planId_currencyId_billingInterval: {
          planId,
          currencyId,
          billingInterval,
        },
      },
    });

    if (existing) {
      throw new AppError('Price for this plan, currency, and interval already exists', 400);
    }

    return prisma.planPrice.create({
      data: {
        planId,
        currencyId,
        billingInterval,
        amountMinor,
        sortOrder: sortOrder ?? 0,
      },
      include: {
        currency: true,
      },
    });
  }

  async updatePlanPrice(id, data) {
    const price = await prisma.planPrice.findUnique({ where: { id } });
    if (!price) {
      throw new AppError('Plan price not found', 404);
    }

    return prisma.planPrice.update({
      where: { id },
      data,
      include: {
        currency: true,
      },
    });
  }
}

export default PlanPriceService;
