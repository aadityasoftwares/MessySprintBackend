import prisma from '../../../config/db.js';
import AppError from '../../../utils/AppError.js';

export class SubscriptionPaymentService {
  async getPayments(userId, { page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;
    const where = {
      ...(userId && { userId }),
    };

    const [total, payments] = await Promise.all([
      prisma.subscriptionPayment.count({ where }),
      prisma.subscriptionPayment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      payments,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPaymentById(id) {
    const payment = await prisma.subscriptionPayment.findUnique({ where: { id } });
    if (!payment) {
      throw new AppError('Payment not found', 404);
    }
    return payment;
  }

  async recordPayment(data) {
    const {
      userId,
      subscriptionId,
      planId,
      planPriceId,
      billingInterval,
      provider = 'STRIPE',
      providerPaymentId,
      providerOrderId,
      amountMinor,
      currency,
      status = 'SUCCESS',
      billingPeriodStart,
      billingPeriodEnd,
      metadata,
    } = data;

    return prisma.subscriptionPayment.create({
      data: {
        userId,
        subscriptionId,
        planId,
        planPriceId,
        billingInterval,
        provider,
        providerPaymentId,
        providerOrderId,
        amountMinor,
        currency,
        status,
        billingPeriodStart: billingPeriodStart ? new Date(billingPeriodStart) : null,
        billingPeriodEnd: billingPeriodEnd ? new Date(billingPeriodEnd) : null,
        capturedAt: status === 'SUCCESS' ? new Date() : null,
        metadata,
      },
    });
  }
}

export default SubscriptionPaymentService;
