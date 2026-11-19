import SubscriptionUsageService from '../services/subscriptionUsage.service.js';
import ResponseUtil from '../../../utils/response.util.js';

export class SubscriptionUsageController {
  constructor() {
    this.usageService = new SubscriptionUsageService();
  }

  getUsage = async (req, res, next) => {
    try {
      const usageList = await this.usageService.getUsage(req.user.id);
      const serialized = usageList.map((item) => ({
        ...item,
        storageBytesUsed: item.storageBytesUsed.toString(),
      }));
      return res.status(200).json(ResponseUtil.success('Usage fetched successfully', serialized));
    } catch (error) {
      next(error);
    }
  };

  incrementUsage = async (req, res, next) => {
    try {
      const { featureCode, amount } = req.body;
      const result = await this.usageService.incrementUsage(req.user.id, featureCode, amount);
      return res.status(200).json(ResponseUtil.success('Usage incremented successfully', {
        ...result,
        storageBytesUsed: result.storageBytesUsed.toString(),
      }));
    } catch (error) {
      next(error);
    }
  };
}

export default SubscriptionUsageController;
