import { Router } from 'express';
import CurrencyController from '../controllers/currency.controller.js';
import authMiddleware from '../../../middlewares/auth.middleware.js';

const currencyRoutes = Router();
const currencyController = new CurrencyController();

currencyRoutes.get('/', currencyController.getCurrencies);
currencyRoutes.post('/', authMiddleware, currencyController.createCurrency);

export default currencyRoutes;
