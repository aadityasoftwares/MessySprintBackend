import { Router } from 'express';
import UserSubscriptionController from '../controllers/userSubscription.controller.js';
import authMiddleware from '../../../middlewares/auth.middleware.js';

const userSubscriptionRoutes = Router();
const userSubscriptionController = new UserSubscriptionController();

userSubscriptionRoutes.get('/current', authMiddleware, userSubscriptionController.getActiveSubscription);
userSubscriptionRoutes.get('/history', authMiddleware, userSubscriptionController.getSubscriptionHistory);
userSubscriptionRoutes.post('/subscribe', authMiddleware, userSubscriptionController.subscribe);
userSubscriptionRoutes.post('/cancel', authMiddleware, userSubscriptionController.cancelSubscription);

export default userSubscriptionRoutes;
