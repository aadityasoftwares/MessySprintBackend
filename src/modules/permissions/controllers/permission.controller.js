import PermissionService from '../services/permission.service.js';
import ResponseUtil from '../../../utils/response.util.js';

export class PermissionController {
  constructor() {
    this.permissionService = new PermissionService();
  }

  getPermissions = async (req, res, next) => {
    try {
      const permissions = await this.permissionService.getPermissions(req.query.module);
      return res.status(200).json(ResponseUtil.success('Permissions fetched successfully', permissions));
    } catch (error) {
      next(error);
    }
  };

  getPermissionById = async (req, res, next) => {
    try {
      const permission = await this.permissionService.getPermissionById(req.params.id);
      return res.status(200).json(ResponseUtil.success('Permission fetched successfully', permission));
    } catch (error) {
      next(error);
    }
  };

  createPermission = async (req, res, next) => {
    try {
      const permission = await this.permissionService.createPermission(req.body);
      return res.status(201).json(ResponseUtil.created('Permission created successfully', permission));
    } catch (error) {
      next(error);
    }
  };
}

export default PermissionController;
