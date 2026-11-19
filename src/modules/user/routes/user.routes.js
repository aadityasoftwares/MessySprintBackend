import { Router } from 'express';
import UserController from '../controllers/user.controller.js';
import authMiddleware from '../../../middlewares/auth.middleware.js';

const userRoutes = Router();
const userController = new UserController();

userRoutes.get('/getall', authMiddleware, userController.getUsers);
userRoutes.get('/get/:id', authMiddleware, userController.getUserById);
userRoutes.patch('/status/:id', authMiddleware, userController.updateUserStatus);
userRoutes.delete('/delete/:id', authMiddleware, userController.deleteUser);

export default userRoutes;
