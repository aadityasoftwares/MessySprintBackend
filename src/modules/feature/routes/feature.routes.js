import { Router } from 'express';
import FeatureController from '../controllers/feature.controller.js';
import authMiddleware from '../../../middlewares/auth.middleware.js';

const featureRoutes = Router();
const featureController = new FeatureController();

featureRoutes.get('/', featureController.getFeatures);
featureRoutes.post('/', authMiddleware, featureController.createFeature);
featureRoutes.put('/:id', authMiddleware, featureController.updateFeature);

export default featureRoutes;
