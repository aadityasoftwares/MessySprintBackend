import UserPreferenceService from '../services/userPreference.service.js';
import ResponseUtil from '../../../utils/response.util.js';

export class UserPreferenceController {
  constructor() {
    this.preferenceService = new UserPreferenceService();
  }

  getPreferences = async (req, res, next) => {
    try {
      const preferences = await this.preferenceService.getPreferences(req.user.id, req.query.category);
      return res.status(200).json(ResponseUtil.success('Preferences fetched successfully', preferences));
    } catch (error) {
      next(error);
    }
  };

  setPreference = async (req, res, next) => {
    try {
      const preference = await this.preferenceService.setPreference(req.user.id, req.body);
      return res.status(200).json(ResponseUtil.success('Preference updated successfully', preference));
    } catch (error) {
      next(error);
    }
  };

  deletePreference = async (req, res, next) => {
    try {
      await this.preferenceService.deletePreference(req.user.id, req.params.key);
      return res.status(200).json(ResponseUtil.success('Preference deleted successfully'));
    } catch (error) {
      next(error);
    }
  };
}

export default UserPreferenceController;
