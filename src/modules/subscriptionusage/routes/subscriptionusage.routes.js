import { Router } from 'express';
import SubscriptionUsageController from '../controllers/subscriptionUsage.controller.js';
import authMiddleware from '../../../middlewares/auth.middleware.js';

const subscriptionUsageRoutes = Router();
const subscriptionUsageController = new SubscriptionUsageController();

subscriptionUsageRoutes.get('/', authMiddleware, subscriptionUsageController.getUsage);
subscriptionUsageRoutes.post('/increment', authMiddleware, subscriptionUsageController.incrementUsage);

export default subscriptionUsageRoutes;
