import prisma from '../../../config/db.js';

export class AuditLogService {
  async getAuditLogs({ page = 1, limit = 20, module, action, actorId }) {
    const skip = (page - 1) * limit;
    const where = {
      ...(module && { module }),
      ...(action && { action }),
      ...(actorId && { actorId }),
    };

    const [total, logs] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          actor: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
      }),
    ]);

    return {
      logs,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createAuditLog(data) {
    const {
      actorId,
      actorType = 'USER',
      action,
      module,
      resourceType,
      resourceId,
      resourceName,
      description,
      status = 'SUCCESS',
      severity = 'INFO',
      changes,
      metadata,
      ipAddress,
      userAgent,
    } = data;

    return prisma.auditLog.create({
      data: {
        actorId,
        actorType,
        action,
        module,
        resourceType,
        resourceId,
        resourceName,
        description,
        status,
        severity,
        changes,
        metadata,
        ipAddress,
        userAgent,
      },
    });
  }
}

export default AuditLogService;
