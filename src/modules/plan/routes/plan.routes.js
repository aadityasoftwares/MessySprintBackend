import { Router } from 'express';
import PlanController from '../controllers/plan.controller.js';
import authMiddleware from '../../../middlewares/auth.middleware.js';

const planRoutes = Router();
const planController = new PlanController();

planRoutes.get('/', planController.getPlans);
planRoutes.get('/:id', planController.getPlanById);
planRoutes.post('/', authMiddleware, planController.createPlan);
planRoutes.put('/:id', authMiddleware, planController.updatePlan);
planRoutes.delete('/:id', authMiddleware, planController.deletePlan);

export default planRoutes;
