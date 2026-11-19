import AuditLogService from '../services/auditLog.service.js';
import ResponseUtil from '../../../utils/response.util.js';

export class AuditLogController {
  constructor() {
    this.auditLogService = new AuditLogService();
  }

  getAuditLogs = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 20;
      const { module, action, actorId } = req.query;

      const { logs, meta } = await this.auditLogService.getAuditLogs({
        page,
        limit,
        module,
        action,
        actorId,
      });

      return res.status(200).json(ResponseUtil.success('Audit logs fetched successfully', logs, meta));
    } catch (error) {
      next(error);
    }
  };
}

export default AuditLogController;
