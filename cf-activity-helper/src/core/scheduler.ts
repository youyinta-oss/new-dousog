import cron from 'node-cron';
import { coreEngine } from './engine';
import { accountRepo } from '../db/repositories/account.repo';
import { activityRepo } from '../db/repositories/activity.repo';
import { cookieStore } from '../modules/auth/cookie-store';
import { ActivityType } from '../types';
import { browserManager } from './browser';
import { logger } from '../utils/logger';

export class Scheduler {
  private tasks: cron.ScheduledTask[] = [];

  /** 启动所有定时任务 */
  async start(): Promise<void> {
    // 确保浏览器已启动
    await browserManager.launch();

    // 每日签到任务 - 每天早上 8:00 执行
    const dailyTask = cron.schedule('0 8 * * *', async () => {
      logger.info('定时任务：每日签到开始');
      try {
        const accounts = accountRepo.getActiveAccounts();
        const accountIds = accounts.map(a => a.id);
        if (accountIds.length > 0) {
          await coreEngine.runForAccounts(accountIds);
        } else {
          logger.info('没有活跃账号，跳过定时任务');
        }
      } catch (error) {
        logger.error(`每日签到任务异常: ${error}`);
      }
    }, {
      timezone: 'Asia/Shanghai',
    });

    // 活动扫描任务 - 每 4 小时扫描一次新活动
    const scanTask = cron.schedule('0 */4 * * *', async () => {
      logger.info('定时任务：活动扫描开始');
      try {
        const context = await browserManager.getContext('scanner');
        const page = await context.newPage();
        try {
          const activities = await (await import('../modules/activity/crawler')).activityCrawler.scanBangCenter(page);
          for (const activity of activities) {
            if (activity.url && activity.name) {
              const id = activity.url.split('/').pop() || activity.url.slice(-8);
              activityRepo.upsert({
                id,
                name: activity.name!,
                url: activity.url!,
                type: activity.type || ActivityType.CLAIM_REWARD,
                source: activity.source!,
                status: activity.status || 'active',
              });
            }
          }
          logger.info(`活动扫描完成，发现 ${activities.length} 个活动`);
        } finally {
          await page.close();
          await browserManager.closeContext('scanner');
        }
      } catch (error) {
        logger.error(`活动扫描任务异常: ${error}`);
      }
    }, {
      timezone: 'Asia/Shanghai',
    });

    // Cookie 有效性检查 - 每天凌晨 2:00
    const cookieCheckTask = cron.schedule('0 2 * * *', async () => {
      logger.info('定时任务：Cookie 有效性检查');
      try {
        const accounts = accountRepo.getAll();
        for (const account of accounts) {
          const cookies = await cookieStore.load(account.qqNumber);
          if (!cookies || !cookieStore.isCookieValid(cookies)) {
            accountRepo.updateCookieValid(account.id, false);
            logger.warn(`账号 ${account.qqNumber} Cookie 已过期`);
          } else {
            accountRepo.updateCookieValid(account.id, true);
          }
        }
      } catch (error) {
        logger.error(`Cookie 检查任务异常: ${error}`);
      }
    }, {
      timezone: 'Asia/Shanghai',
    });

    this.tasks.push(dailyTask, scanTask, cookieCheckTask);
    logger.info('定时任务调度器已启动');
  }

  /** 停止所有定时任务 */
  stop(): void {
    this.tasks.forEach(task => task.stop());
    this.tasks = [];
    logger.info('定时任务调度器已停止');
  }

  /** 获取任务数量 */
  getTaskCount(): number {
    return this.tasks.length;
  }
}

export const scheduler = new Scheduler();