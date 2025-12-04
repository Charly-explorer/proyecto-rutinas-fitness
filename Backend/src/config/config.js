import 'dotenv/config';
export const config = {
     PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT || 3306,
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',

  JWT_SECRET: process.env.JWT_SECRET || 'supersecreto_dev',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h'
} 