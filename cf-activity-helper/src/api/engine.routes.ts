import { Router, Request, Response } from 'express';
import { coreEngine } from '../core/engine';
import { accountRepo } from '../db/repositories/account.repo';
import { authMiddleware } from './middleware';
import { ApiResponse, EngineStatus } from '../types';
import { logger } from '../utils/logger';

const router = Router();

router.use(authMiddleware);

/** 手动触发全量领取 */
router.post('/run', async (req: Request, res: Response) => {
  try {
    const { account_ids } = req.body;

    let ids: number[];
    if (account_ids && Array.isArray(account_ids)) {
      ids = account_ids;
    } else {
      ids = accountRepo.getActiveAccounts().map(a => a.id);
    }

    if (ids.length === 0) {
      res.status(400).json({
        code: 400,
        message: '没有可执行的账号',
      } as ApiResponse);
      return;
    }

    // 异步执行，立即返回
    const resultPromise = coreEngine.runForAccounts(ids);

    res.json({
      code: 0,
      message: '任务已启动',
      data: {
        total_accounts: ids.length,
        estimated_time: `约 ${ids.length * 2}-${ids.length * 5} 分钟`,
      },
    } as ApiResponse);

    // 后台执行
    resultPromise.catch(err => logger.error(`引擎执行异常: ${err}`));
  } catch (error) {
    logger.error(`启动引擎失败: ${error}`);
    res.status(500).json({
      code: 500,
      message: `启动失败: ${error instanceof Error ? error.message : String(error)}`,
    } as ApiResponse);
  }
});

/** 为指定账号执行领取 */
router.post('/run/:accountId', async (req: Request, res: Response) => {
  try {
    const accountId = parseInt(req.params.accountId as string, 10);
    const account = accountRepo.getById(accountId);

    if (!account) {
      res.status(404).json({
        code: 404,
        message: '账号不存在',
      } as ApiResponse);
      return;
    }

    const results = await coreEngine.runForAccount(account.qqNumber, account.id);

    res.json({
      code: 0,
      message: '执行完成',
      data: {
        account_id: accountId,
        results,
        success_count: results.filter(r => r.success).length,
        fail_count: results.filter(r => !r.success).length,
      },
    } as ApiResponse);
  } catch (error) {
    logger.error(`执行失败: ${error}`);
    res.status(500).json({
      code: 500,
      message: `执行失败: ${error instanceof Error ? error.message : String(error)}`,
    } as ApiResponse);
  }
});

/** 获取引擎运行状态 */
router.get('/status', (req: Request, res: Response) => {
  const status = coreEngine.getStatus();

  res.json({
    code: 0,
    message: 'ok',
    data: status,
  } as ApiResponse<EngineStatus>);
});

export default router;