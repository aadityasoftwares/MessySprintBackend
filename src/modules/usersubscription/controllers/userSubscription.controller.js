import UserSubscriptionService from '../services/userSubscription.service.js';
import ResponseUtil from '../../../utils/response.util.js';

export class UserSubscriptionController {
  constructor() {
    this.subscriptionService = new UserSubscriptionService();
  }

  getActiveSubscription = async (req, res, next) => {
    try {
      const subscription = await this.subscriptionService.getActiveSubscription(req.user.id);
      return res.status(200).json(ResponseUtil.success('Active subscription fetched successfully', subscription));
    } catch (error) {
      next(error);
    }
  };

  getSubscriptionHistory = async (req, res, next) => {
    try {
      const history = await this.subscriptionService.getSubscriptionHistory(req.user.id);
      return res.status(200).json(ResponseUtil.success('Subscription history fetched successfully', history));
    } catch (error) {
      next(error);
    }
  };

  subscribe = async (req, res, next) => {
    try {
      const subscription = await this.subscriptionService.subscribe(req.user.id, req.body);
      return res.status(201).json(ResponseUtil.created('Subscribed successfully', subscription));
    } catch (error) {
      next(error);
    }
  };

  cancelSubscription = async (req, res, next) => {
    try {
      const result = await this.subscriptionService.cancelSubscription(req.user.id, req.body);
      return res.status(200).json(ResponseUtil.success('Subscription set to cancel at period end', result));
    } catch (error) {
      next(error);
    }
  };
}

export default UserSubscriptionController;
