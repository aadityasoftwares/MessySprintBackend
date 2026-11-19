import UserService from '../services/user.service.js';
import ResponseUtil from '../../../utils/response.util.js';

export class UserController {
  constructor() {
    this.userService = new UserService();
  }

  getUsers = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const search = req.query.search || '';

      const { users, meta } = await this.userService.getUsers({ page, limit, search });
      return res.status(200).json(ResponseUtil.success('Users fetched successfully', users, meta));
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (req, res, next) => {
    try {
      const user = await this.userService.getUserById(req.params.id);
      return res.status(200).json(ResponseUtil.success('User fetched successfully', user));
    } catch (error) {
      next(error);
    }
  };

  updateUserStatus = async (req, res, next) => {
    try {
      const user = await this.userService.updateUserStatus(req.params.id, req.body.status);
      return res.status(200).json(ResponseUtil.success('User status updated successfully', user));
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req, res, next) => {
    try {
      await this.userService.deleteUser(req.params.id);
      return res.status(200).json(ResponseUtil.success('User deleted successfully'));
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
