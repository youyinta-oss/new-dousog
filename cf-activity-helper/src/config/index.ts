import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  apiSecretKey: process.env.API_SECRET_KEY || 'dev-secret-key',
  cookieEncryptKey: process.env.COOKIE_ENCRYPT_KEY || '',
  webhookUrl: process.env.WEBHOOK_URL || '',
  webhookSecret: process.env.WEBHOOK_SECRET || '',
  emailSmtpHost: process.env.EMAIL_SMTP_HOST || '',
  emailSmtpPort: parseInt(process.env.EMAIL_SMTP_PORT || '587', 10),
  emailUser: process.env.EMAIL_USER || '',
  emailPass: process.env.EMAIL_PASS || '',
  proxyUrl: process.env.PROXY_URL || '',
  logLevel: process.env.LOG_LEVEL || 'info',
  logMaxFiles: parseInt(process.env.LOG_MAX_FILES || '30', 10),
  dbPath: path.join(process.cwd(), 'data', 'cf-helper.db'),
  cookieDir: path.join(process.cwd(), 'data', 'cookies'),
  logDir: path.join(process.cwd(), 'logs'),
};
