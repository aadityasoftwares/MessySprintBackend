import { Router } from 'express';
import PlanFeatureController from '../controllers/planFeature.controller.js';
import authMiddleware from '../../../middlewares/auth.middleware.js';

const planFeatureRoutes = Router();
const planFeatureController = new PlanFeatureController();

planFeatureRoutes.get('/:planId', planFeatureController.getPlanFeatures);
planFeatureRoutes.post('/', authMiddleware, planFeatureController.setPlanFeature);
planFeatureRoutes.delete('/:planId/:featureId', authMiddleware, planFeatureController.removePlanFeature);

export default planFeatureRoutes;
