import SystemSettingService from '../services/systemSetting.service.js';
import ResponseUtil from '../../../utils/response.util.js';

export class SystemSettingController {
  constructor() {
    this.settingService = new SystemSettingService();
  }

  getPublicSettings = async (req, res, next) => {
    try {
      const settings = await this.settingService.getSettings(true, req.query.category);
      return res.status(200).json(ResponseUtil.success('Public settings fetched successfully', settings));
    } catch (error) {
      next(error);
    }
  };

  getAllSettings = async (req, res, next) => {
    try {
      const settings = await this.settingService.getSettings(false, req.query.category);
      return res.status(200).json(ResponseUtil.success('All settings fetched successfully', settings));
    } catch (error) {
      next(error);
    }
  };

  getSettingByKey = async (req, res, next) => {
    try {
      const setting = await this.settingService.getSettingByKey(req.params.key);
      return res.status(200).json(ResponseUtil.success('Setting fetched successfully', setting));
    } catch (error) {
      next(error);
    }
  };

  setSetting = async (req, res, next) => {
    try {
      const setting = await this.settingService.setSetting(req.body);
      return res.status(200).json(ResponseUtil.success('Setting saved successfully', setting));
    } catch (error) {
      next(error);
    }
  };
}

export default SystemSettingController;
