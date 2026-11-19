import prisma from '../../../config/db.js';
import AppError from '../../../utils/AppError.js';

export class UserSubscriptionService {
  async getActiveSubscription(userId) {
    const subscription = await prisma.userSubscription.findFirst({
      where: {
        userId,
        isActive: true,
      },
      include: {
        plan: {
          include: {
            features: {
              where: { isEnabled: true },
              include: { feature: true },
            },
          },
        },
        planPrice: {
          include: { currency: true },
        },
      },
    });

    return subscription;
  }

  async getSubscriptionHistory(userId) {
    return prisma.userSubscription.findMany({
      where: { userId },
      include: {
        plan: true,
        planPrice: {
          include: { currency: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async subscribe(userId, { planId, planPriceId, paymentProvider, providerSubscriptionId, providerCustomerId }) {
    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan || !plan.isActive) {
      throw new AppError('Plan not found or inactive', 404);
    }

    let planPrice = null;
    if (planPriceId) {
      planPrice = await prisma.planPrice.findUnique({ where: { id: planPriceId } });
      if (!planPrice || !planPrice.isActive) {
        throw new AppError('Plan price not found or inactive', 404);
      }
    }

    return prisma.$transaction(async (tx) => {
      // Deactivate current active subscriptions
      await tx.userSubscription.updateMany({
        where: { userId, isActive: true },
        data: { isActive: false, status: 'EXPIRED' },
      });

      const now = new Date();
      let currentPeriodEnd = null;
      if (planPrice) {
        const days = planPrice.billingInterval === 'ANNUAL' ? 365 : 30;
        currentPeriodEnd = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
      }

      return tx.userSubscription.create({
        data: {
          userId,
          planId,
          planPriceId,
          billingInterval: planPrice ? planPrice.billingInterval : null,
          status: 'ACTIVE',
          startDate: now,
          currentPeriodStart: now,
          currentPeriodEnd,
          paymentProvider,
          providerSubscriptionId,
          providerCustomerId,
          isActive: true,
        },
        include: {
          plan: true,
          planPrice: {
            include: { currency: true },
          },
        },
      });
    });
  }

  async cancelSubscription(userId, { reason }) {
    const currentSub = await prisma.userSubscription.findFirst({
      where: { userId, isActive: true },
    });

    if (!currentSub) {
      throw new AppError('No active subscription found to cancel', 404);
    }

    return prisma.userSubscription.update({
      where: { id: currentSub.id },
      data: {
        cancelAtPeriodEnd: true,
        canceledAt: new Date(),
        cancellationReason: reason || 'User requested cancellation',
      },
    });
  }
}

export default UserSubscriptionService;
