import { Router } from 'express';
import PlanPriceController from '../controllers/planPrice.controller.js';
import authMiddleware from '../../../middlewares/auth.middleware.js';

const planPriceRoutes = Router();
const planPriceController = new PlanPriceController();

planPriceRoutes.get('/', planPriceController.getPlanPrices);
planPriceRoutes.post('/', authMiddleware, planPriceController.createPlanPrice);
planPriceRoutes.put('/:id', authMiddleware, planPriceController.updatePlanPrice);

export default planPriceRoutes;
