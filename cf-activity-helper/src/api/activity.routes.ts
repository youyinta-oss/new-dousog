import { Router, Request, Response } from 'express';
import { activityRepo } from '../db/repositories/activity.repo';
import { activityCrawler } from '../modules/activity/crawler';
import { browserManager } from '../core/browser';
import { coreEngine } from '../core/engine';
import { authMiddleware } from './middleware';
import { ApiResponse, ActivityInfo, ActivityType } from '../types';
import { logger } from '../utils/logger';

const router = Router();

router.use(authMiddleware);

/** 获取活动列表 */
router.get('/', (req: Request, res: Response) => {
  const { status } = req.query;
  let activities: ActivityInfo[];

  if (status === 'active') {
    activities = activityRepo.getActive();
  } else {
    activities = activityRepo.getAll();
  }

  res.json({
    code: 0,
    message: 'ok',
    data: activities,
  } as ApiResponse<ActivityInfo[]>);
});

/** 手动触发活动扫描 */
router.post('/scan', async (req: Request, res: Response) => {
  try {
    await browserManager.launch();
    const context = await browserManager.getContext('scanner');
    const page = await context.newPage();

    try {
      const activities = await activityCrawler.scanBangCenter(page);

      let newCount = 0;
      for (const activity of activities) {
        if (activity.url && activity.name) {
          const existing = activityRepo.getByUrl(activity.url);
          if (!existing) {
            newCount++;
          }
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

      await page.close();
      await browserManager.closeContext('scanner');

      res.json({
        code: 0,
        message: `扫描完成，发现 ${activities.length} 个活动，其中 ${newCount} 个新活动`,
        data: { total: activities.length, newCount },
      } as ApiResponse);
    } catch (error) {
      await page.close();
      await browserManager.closeContext('scanner');
      throw error;
    }
  } catch (error) {
    logger.error(`活动扫描失败: ${error}`);
    res.status(500).json({
      code: 500,
      message: `扫描失败: ${error instanceof Error ? error.message : String(error)}`,
    } as ApiResponse);
  }
});

/** 手动执行单个活动 */
router.post('/:id/run', async (req: Request, res: Response) => {
  try {
    const activity = activityRepo.getById(req.params.id as string);
    if (!activity) {
      res.status(404).json({
        code: 404,
        message: '活动不存在',
      } as ApiResponse);
      return;
    }

    // 使用第一个活跃账号执行
    const { accountRepo: acctRepo } = await import('../db/repositories/account.repo');
    const accounts = acctRepo.getActiveAccounts();
    if (accounts.length === 0) {
      res.status(400).json({
        code: 400,
        message: '没有活跃账号',
      } as ApiResponse);
      return;
    }

    const account = accounts[0];
    const results = await coreEngine.runForAccount(account.qqNumber, account.id);

    res.json({
      code: 0,
      message: '执行完成',
      data: results,
    } as ApiResponse);
  } catch (error) {
    logger.error(`执行活动失败: ${error}`);
    res.status(500).json({
      code: 500,
      message: `执行失败: ${error instanceof Error ? error.message : String(error)}`,
    } as ApiResponse);
  }
});

export default router;