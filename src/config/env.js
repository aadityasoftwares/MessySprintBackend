import 'dotenv/config';

export const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:4200',
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET || 'messysprint_jwt_secret_key_default',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'messysprint_access_token_secret',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'messysprint_refresh_token_secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
};

export default env;
