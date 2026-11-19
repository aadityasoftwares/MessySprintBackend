import FeatureService from '../services/feature.service.js';
import ResponseUtil from '../../../utils/response.util.js';

export class FeatureController {
  constructor() {
    this.featureService = new FeatureService();
  }

  getFeatures = async (req, res, next) => {
    try {
      const features = await this.featureService.getFeatures(req.query.category);
      return res.status(200).json(ResponseUtil.success('Features fetched successfully', features));
    } catch (error) {
      next(error);
    }
  };

  createFeature = async (req, res, next) => {
    try {
      const feature = await this.featureService.createFeature(req.body);
      return res.status(201).json(ResponseUtil.created('Feature created successfully', feature));
    } catch (error) {
      next(error);
    }
  };

  updateFeature = async (req, res, next) => {
    try {
      const feature = await this.featureService.updateFeature(req.params.id, req.body);
      return res.status(200).json(ResponseUtil.success('Feature updated successfully', feature));
    } catch (error) {
      next(error);
    }
  };
}

export default FeatureController;
