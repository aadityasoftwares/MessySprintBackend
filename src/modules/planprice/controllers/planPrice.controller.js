import PlanPriceService from '../services/planPrice.service.js';
import ResponseUtil from '../../../utils/response.util.js';

export class PlanPriceController {
  constructor() {
    this.planPriceService = new PlanPriceService();
  }

  getPlanPrices = async (req, res, next) => {
    try {
      const prices = await this.planPriceService.getPlanPrices(req.query.planId);
      return res.status(200).json(ResponseUtil.success('Plan prices fetched successfully', prices));
    } catch (error) {
      next(error);
    }
  };

  createPlanPrice = async (req, res, next) => {
    try {
      const price = await this.planPriceService.createPlanPrice(req.body);
      return res.status(201).json(ResponseUtil.created('Plan price created successfully', price));
    } catch (error) {
      next(error);
    }
  };

  updatePlanPrice = async (req, res, next) => {
    try {
      const price = await this.planPriceService.updatePlanPrice(req.params.id, req.body);
      return res.status(200).json(ResponseUtil.success('Plan price updated successfully', price));
    } catch (error) {
      next(error);
    }
  };
}

export default PlanPriceController;
