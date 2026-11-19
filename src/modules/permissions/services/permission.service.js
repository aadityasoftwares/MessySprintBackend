import prisma from '../../../config/db.js';
import AppError from '../../../utils/AppError.js';

export class PermissionService {
  async getPermissions(module) {
    const where = {
      ...(module && { module: module.toUpperCase() }),
    };

    return prisma.permission.findMany({
      where,
      orderBy: [{ module: 'asc' }, { sortOrder: 'asc' }],
    });
  }

  async getPermissionById(id) {
    const permission = await prisma.permission.findUnique({ where: { id } });
    if (!permission) {
      throw new AppError('Permission not found', 404);
    }
    return permission;
  }

  async createPermission(data) {
    const { name, displayName, code, module, action, access, description, sortOrder } = data;

    const existing = await prisma.permission.findFirst({
      where: { OR: [{ name: name.toLowerCase() }, { code: code.toUpperCase() }] },
    });

    if (existing) {
      throw new AppError('Permission name or code already exists', 400);
    }

    return prisma.permission.create({
      data: {
        name: name.toLowerCase(),
        displayName,
        code: code.toUpperCase(),
        module: module.toUpperCase(),
        action,
        access: access || 'GENERAL',
        description,
        sortOrder: sortOrder ?? 0,
      },
    });
  }
}

export default PermissionService;
