import { Router } from 'express';
import UserPreferenceController from '../controllers/userPreference.controller.js';
import authMiddleware from '../../../middlewares/auth.middleware.js';

const userPreferenceRoutes = Router();
const userPreferenceController = new UserPreferenceController();

userPreferenceRoutes.get('/', authMiddleware, userPreferenceController.getPreferences);
userPreferenceRoutes.post('/', authMiddleware, userPreferenceController.setPreference);
userPreferenceRoutes.delete('/:key', authMiddleware, userPreferenceController.deletePreference);

export default userPreferenceRoutes;
