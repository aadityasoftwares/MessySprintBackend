import { Router } from 'express';
import UserProfileController from '../controllers/userProfile.controller.js';
import authMiddleware from '../../../middlewares/auth.middleware.js';

const userProfileRoutes = Router();
const userProfileController = new UserProfileController();

userProfileRoutes.get('/', authMiddleware, userProfileController.getProfile);
userProfileRoutes.get('/:userId', authMiddleware, userProfileController.getProfile);
userProfileRoutes.put('/', authMiddleware, userProfileController.updateProfile);

export default userProfileRoutes;
