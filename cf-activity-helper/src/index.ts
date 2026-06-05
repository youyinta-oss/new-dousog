import express from 'express';
import { config } from './config';
import { initDatabase, closeDatabase } from './db/database';
import { scheduler } from './core/scheduler';
import { browserManager } from './core/browser';
import apiRoutes from './api/routes';
import { generateToken, authMiddleware, requestLogger, errorHandler } from './api/middleware';
import { logger } from './utils/logger';

const app = express();

// 中间件
app.use(express.json());
app.use(requestLogger);

// 健康检查（无需认证）
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 登录获取 Token（无需认证）
app.post('/api/auth/token', (req, res) => {
  const { secret } = req.body;
  if (secret !== config.apiSecretKey) {
    res.status(401).json({ code: 401, message: '密钥错误' });
    return;
  }
  const token = generateToken();
  res.json({ code: 0, message: 'ok', data: { token } });
});

// API 路由
app.use('/api', apiRoutes);

// 错误处理
app.use(errorHandler);

async function start() {
  try {
    // 初始化数据库
    initDatabase();
    logger.info('数据库初始化完成');

    // 启动定时任务
    await scheduler.start();
    logger.info('定时任务已启动');

    // 启动 HTTP 服务
    app.listen(config.port, () => {
      logger.info(`CF 活动领取助手已启动: http://localhost:${config.port}`);
      logger.info(`环境: ${config.nodeEnv}`);
    });
  } catch (error) {
    logger.error(`启动失败: ${error}`);
    process.exit(1);
  }
}

// 优雅关闭
process.on('SIGINT', async () => {
  logger.info('正在关闭服务...');
  scheduler.stop();
  await browserManager.close();
  closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('收到 SIGTERM 信号，正在关闭...');
  scheduler.stop();
  await browserManager.close();
  closeDatabase();
  process.exit(0);
});

start();