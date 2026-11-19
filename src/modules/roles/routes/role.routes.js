import { Router } from 'express';
import RoleController from '../controllers/role.controller.js';
import authMiddleware from '../../../middlewares/auth.middleware.js';

const roleRoutes = Router();
const roleController = new RoleController();

roleRoutes.get('/', authMiddleware, roleController.getRoles);
roleRoutes.get('/:id', authMiddleware, roleController.getRoleById);
roleRoutes.post('/', authMiddleware, roleController.createRole);
roleRoutes.put('/:id', authMiddleware, roleController.updateRole);
roleRoutes.delete('/:id', authMiddleware, roleController.deleteRole);

export default roleRoutes;
