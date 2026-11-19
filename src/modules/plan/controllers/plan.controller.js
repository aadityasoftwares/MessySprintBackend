import PlanService from '../services/plan.service.js';
import ResponseUtil from '../../../utils/response.util.js';

export class PlanController {
  constructor() {
    this.planService = new PlanService();
  }

  getPlans = async (req, res, next) => {
    try {
      const includeInactive = req.query.includeInactive === 'true';
      const plans = await this.planService.getPlans(includeInactive);
      return res.status(200).json(ResponseUtil.success('Plans fetched successfully', plans));
    } catch (error) {
      next(error);
    }
  };

  getPlanById = async (req, res, next) => {
    try {
      const plan = await this.planService.getPlanById(req.params.id);
      return res.status(200).json(ResponseUtil.success('Plan fetched successfully', plan));
    } catch (error) {
      next(error);
    }
  };

  createPlan = async (req, res, next) => {
    try {
      const plan = await this.planService.createPlan(req.body);
      return res.status(201).json(ResponseUtil.created('Plan created successfully', plan));
    } catch (error) {
      next(error);
    }
  };

  updatePlan = async (req, res, next) => {
    try {
      const plan = await this.planService.updatePlan(req.params.id, req.body);
      return res.status(200).json(ResponseUtil.success('Plan updated successfully', plan));
    } catch (error) {
      next(error);
    }
  };

  deletePlan = async (req, res, next) => {
    try {
      await this.planService.deletePlan(req.params.id);
      return res.status(200).json(ResponseUtil.success('Plan deleted successfully'));
    } catch (error) {
      next(error);
    }
  };
}

export default PlanController;
