import { Router } from 'express';
import PermissionController from '../controllers/permission.controller.js';
import authMiddleware from '../../../middlewares/auth.middleware.js';

const permissionRoutes = Router();
const permissionController = new PermissionController();

permissionRoutes.get('/', authMiddleware, permissionController.getPermissions);
permissionRoutes.get('/:id', authMiddleware, permissionController.getPermissionById);
permissionRoutes.post('/', authMiddleware, permissionController.createPermission);

export default permissionRoutes;
