import UserProfileService from '../services/userProfile.service.js';
import ResponseUtil from '../../../utils/response.util.js';

export class UserProfileController {
  constructor() {
    this.profileService = new UserProfileService();
  }

  getProfile = async (req, res, next) => {
    try {
      const targetUserId = req.params.userId || req.user.id;
      const profile = await this.profileService.getProfile(targetUserId);
      return res.status(200).json(ResponseUtil.success('Profile retrieved successfully', profile));
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req, res, next) => {
    try {
      const profile = await this.profileService.updateProfile(req.user.id, req.body);
      return res.status(200).json(ResponseUtil.success('Profile updated successfully', profile));
    } catch (error) {
      next(error);
    }
  };
}

export default UserProfileController;
