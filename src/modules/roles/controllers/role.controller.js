import RoleService from '../services/role.service.js';
import ResponseUtil from '../../../utils/response.util.js';

export class RoleController {
  constructor() {
    this.roleService = new RoleService();
  }

  getRoles = async (req, res, next) => {
    try {
      const roles = await this.roleService.getRoles();
      return res.status(200).json(ResponseUtil.success('Roles fetched successfully', roles));
    } catch (error) {
      next(error);
    }
  };

  getRoleById = async (req, res, next) => {
    try {
      const role = await this.roleService.getRoleById(req.params.id);
      return res.status(200).json(ResponseUtil.success('Role fetched successfully', role));
    } catch (error) {
      next(error);
    }
  };

  createRole = async (req, res, next) => {
    try {
      const role = await this.roleService.createRole(req.body);
      return res.status(201).json(ResponseUtil.created('Role created successfully', role));
    } catch (error) {
      next(error);
    }
  };

  updateRole = async (req, res, next) => {
    try {
      const role = await this.roleService.updateRole(req.params.id, req.body);
      return res.status(200).json(ResponseUtil.success('Role updated successfully', role));
    } catch (error) {
      next(error);
    }
  };

  deleteRole = async (req, res, next) => {
    try {
      await this.roleService.deleteRole(req.params.id);
      return res.status(200).json(ResponseUtil.success('Role deleted successfully'));
    } catch (error) {
      next(error);
    }
  };
}

export default RoleController;
