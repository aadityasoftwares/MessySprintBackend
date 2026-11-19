import CurrencyService from '../services/currency.service.js';
import ResponseUtil from '../../../utils/response.util.js';

export class CurrencyController {
  constructor() {
    this.currencyService = new CurrencyService();
  }

  getCurrencies = async (req, res, next) => {
    try {
      const currencies = await this.currencyService.getCurrencies();
      return res.status(200).json(ResponseUtil.success('Currencies fetched successfully', currencies));
    } catch (error) {
      next(error);
    }
  };

  createCurrency = async (req, res, next) => {
    try {
      const currency = await this.currencyService.createCurrency(req.body);
      return res.status(201).json(ResponseUtil.created('Currency created successfully', currency));
    } catch (error) {
      next(error);
    }
  };
}

export default CurrencyController;
