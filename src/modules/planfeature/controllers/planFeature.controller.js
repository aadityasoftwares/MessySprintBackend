import PlanFeatureService from '../services/planFeature.service.js';
import ResponseUtil from '../../../utils/response.util.js';

export class PlanFeatureController {
  constructor() {
    this.planFeatureService = new PlanFeatureService();
  }

  getPlanFeatures = async (req, res, next) => {
    try {
      const planFeatures = await this.planFeatureService.getPlanFeatures(req.params.planId);
      return res.status(200).json(ResponseUtil.success('Plan features fetched successfully', planFeatures));
    } catch (error) {
      next(error);
    }
  };

  setPlanFeature = async (req, res, next) => {
    try {
      const planFeature = await this.planFeatureService.setPlanFeature(req.body);
      return res.status(200).json(ResponseUtil.success('Plan feature configured successfully', planFeature));
    } catch (error) {
      next(error);
    }
  };

  removePlanFeature = async (req, res, next) => {
    try {
      await this.planFeatureService.removePlanFeature(req.params.planId, req.params.featureId);
      return res.status(200).json(ResponseUtil.success('Plan feature removed successfully'));
    } catch (error) {
      next(error);
    }
  };
}

export default PlanFeatureController;
