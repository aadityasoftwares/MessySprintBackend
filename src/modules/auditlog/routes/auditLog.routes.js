import { Router } from 'express';
import AuditLogController from '../controllers/auditLog.controller.js';
import authMiddleware from '../../../middlewares/auth.middleware.js';

const auditLogRoutes = Router();
const auditLogController = new AuditLogController();

auditLogRoutes.get('/', authMiddleware, auditLogController.getAuditLogs);

export default auditLogRoutes;
