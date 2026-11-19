import prisma from '../../../config/db.js';
import AppError from '../../../utils/AppError.js';

export class CurrencyService {
  async getCurrencies() {
    return prisma.currency.findMany({
      where: { isActive: true },
      orderBy: { code: 'asc' },
    });
  }

  async createCurrency(data) {
    const { name, code, symbol, numericCode, decimalPlaces, isDefault } = data;

    const existing = await prisma.currency.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (existing) {
      throw new AppError('Currency with this code already exists', 400);
    }

    if (isDefault) {
      await prisma.currency.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }

    return prisma.currency.create({
      data: {
        name,
        code: code.toUpperCase(),
        symbol,
        numericCode,
        decimalPlaces: decimalPlaces ?? 2,
        isDefault: isDefault ?? false,
      },
    });
  }
}

export default CurrencyService;
