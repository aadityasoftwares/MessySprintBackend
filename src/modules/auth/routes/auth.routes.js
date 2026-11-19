import { Router } from 'express';
import AuthController from '../controllers/auth.controller.js';
import validateUsingZOD from '../../../utils/validations/zodValidate.util.js';
import { registerSchema, loginSchema } from '../validations/auth.validation.js';
import authMiddleware from '../../../middlewares/auth.middleware.js';

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post('/register', validateUsingZOD(registerSchema), authController.register);
authRoutes.post('/login', validateUsingZOD(loginSchema), authController.login);
authRoutes.post('/refreshtoken', authController.refreshToken);
authRoutes.post('/logout', authMiddleware, authController.logout);
authRoutes.post('/logoutall', authMiddleware, authController.logoutAll);
authRoutes.get('/me', authMiddleware, authController.me);

export default authRoutes;
