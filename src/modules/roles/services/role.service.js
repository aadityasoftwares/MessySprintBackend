import prisma from '../../../config/db.js';
import AppError from '../../../utils/AppError.js';

export class RoleService {
  async getRoles() {
    return prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        _count: {
          select: { users: true },
        },
      },
      orderBy: { priority: 'desc' },
    });
  }

  async getRoleById(id) {
    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!role) {
      throw new AppError('Role not found', 404);
    }

    return role;
  }

  async createRole(data) {
    const { name, displayName, code, description, type, priority, isDefault, permissionIds = [] } = data;

    const existingRole = await prisma.role.findFirst({
      where: { OR: [{ name: name.toLowerCase() }, { code: code.toUpperCase() }] },
    });

    if (existingRole) {
      throw new AppError('Role name or code already exists', 400);
    }

    return prisma.role.create({
      data: {
        name: name.toLowerCase(),
        displayName,
        code: code.toUpperCase(),
        description,
        type: type || 'CUSTOM',
        priority: priority ?? 50,
        isDefault: isDefault ?? false,
        permissions: {
          create: permissionIds.map((pId) => ({
            permission: { connect: { id: pId } },
          })),
        },
      },
      include: {
        permissions: {
          include: { permission: true },
        },
      },
    });
  }

  async updateRole(id, data) {
    const { displayName, description, priority, isDefault, isActive, permissionIds } = data;

    const role = await prisma.role.findUnique({ where: { id } });
    if (!role) {
      throw new AppError('Role not found', 404);
    }

    if (role.isSystem && isActive === false) {
      throw new AppError('Cannot deactivate a system role', 400);
    }

    return prisma.$transaction(async (tx) => {
      if (permissionIds) {
        await tx.rolePermission.deleteMany({ where: { roleId: id } });
        await tx.rolePermission.createMany({
          data: permissionIds.map((pId) => ({
            roleId: id,
            permissionId: pId,
          })),
        });
      }

      return tx.role.update({
        where: { id },
        data: {
          ...(displayName && { displayName }),
          ...(description !== undefined && { description }),
          ...(priority !== undefined && { priority }),
          ...(isDefault !== undefined && { isDefault }),
          ...(isActive !== undefined && { isActive }),
        },
        include: {
          permissions: {
            include: { permission: true },
          },
        },
      });
    });
  }

  async deleteRole(id) {
    const role = await prisma.role.findUnique({
      where: { id },
      include: { _count: { select: { users: true } } },
    });

    if (!role) {
      throw new AppError('Role not found', 404);
    }

    if (role.isSystem) {
      throw new AppError('Cannot delete a system role', 400);
    }

    if (role._count.users > 0) {
      throw new AppError('Cannot delete role assigned to active users', 400);
    }

    await prisma.role.delete({ where: { id } });
  }
}

export default RoleService;
