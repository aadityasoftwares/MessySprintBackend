import { Router } from 'express';
import SystemSettingController from '../controllers/systemSetting.controller.js';
import authMiddleware from '../../../middlewares/auth.middleware.js';

const systemSettingRoutes = Router();
const systemSettingController = new SystemSettingController();

systemSettingRoutes.get('/public', systemSettingController.getPublicSettings);
systemSettingRoutes.get('/all', authMiddleware, systemSettingController.getAllSettings);
systemSettingRoutes.get('/:key', authMiddleware, systemSettingController.getSettingByKey);
systemSettingRoutes.post('/', authMiddleware, systemSettingController.setSetting);

export default systemSettingRoutes;
