import SubscriptionPaymentService from '../services/subscriptionPayment.service.js';
import ResponseUtil from '../../../utils/response.util.js';

export class SubscriptionPaymentController {
  constructor() {
    this.paymentService = new SubscriptionPaymentService();
  }

  getPayments = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      // Normal users can only see their own payments
      const userId = req.user.role === 'ADMIN' && req.query.userId ? req.query.userId : req.user.id;

      const { payments, meta } = await this.paymentService.getPayments(userId, { page, limit });
      return res.status(200).json(ResponseUtil.success('Payments fetched successfully', payments, meta));
    } catch (error) {
      next(error);
    }
  };

  getPaymentById = async (req, res, next) => {
    try {
      const payment = await this.paymentService.getPaymentById(req.params.id);
      return res.status(200).json(ResponseUtil.success('Payment fetched successfully', payment));
    } catch (error) {
      next(error);
    }
  };

  recordPayment = async (req, res, next) => {
    try {
      const payment = await this.paymentService.recordPayment({
        ...req.body,
        userId: req.user.id,
      });
      return res.status(201).json(ResponseUtil.created('Payment recorded successfully', payment));
    } catch (error) {
      next(error);
    }
  };
}

export default SubscriptionPaymentController;
