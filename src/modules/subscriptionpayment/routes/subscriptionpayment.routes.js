import { Router } from 'express';
import SubscriptionPaymentController from '../controllers/subscriptionPayment.controller.js';
import authMiddleware from '../../../middlewares/auth.middleware.js';

const subscriptionPaymentRoutes = Router();
const subscriptionPaymentController = new SubscriptionPaymentController();

subscriptionPaymentRoutes.get('/', authMiddleware, subscriptionPaymentController.getPayments);
subscriptionPaymentRoutes.get('/:id', authMiddleware, subscriptionPaymentController.getPaymentById);
subscriptionPaymentRoutes.post('/', authMiddleware, subscriptionPaymentController.recordPayment);

export default subscriptionPaymentRoutes;
