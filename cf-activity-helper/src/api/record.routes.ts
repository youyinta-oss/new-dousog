import { Router, Request, Response } from 'express';
import { recordRepo, RecordStats } from '../db/repositories/record.repo';
import { authMiddleware } from './middleware';
import { ApiResponse } from '../types';

const router = Router();

router.use(authMiddleware);

/** 查询领取记录 */
router.get('/', (req: Request, res: Response) => {
  const { account_id, activity_id, success, page, limit } = req.query;

  const options = {
    accountId: account_id ? parseInt(account_id as string, 10) : undefined,
    activityId: activity_id as string,
    success: success === 'true' ? true : success === 'false' ? false : undefined,
    page: page ? parseInt(page as string, 10) : 1,
    limit: limit ? parseInt(limit as string, 10) : 20,
  };

  const result = recordRepo.query(options);

  res.json({
    code: 0,
    message: 'ok',
    data: result,
  } as ApiResponse);
});

/** 获取统计数据 */
router.get('/stats', (req: Request, res: Response) => {
  const stats = recordRepo.getStats();

  res.json({
    code: 0,
    message: 'ok',
    data: stats,
  } as ApiResponse<RecordStats>);
});

export default router;