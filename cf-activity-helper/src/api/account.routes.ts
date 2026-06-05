import { Router, Request, Response } from 'express';
import { accountManager } from '../modules/account/manager';
import { authMiddleware, generateToken } from './middleware';
import { ApiResponse, AccountInfo } from '../types';
import { logger } from '../utils/logger';

const router = Router();

// 所有账号路由需要认证
router.use(authMiddleware);

/** 添加账号 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { qq_number, cookie } = req.body;

    if (!qq_number || !cookie) {
      res.status(400).json({
        code: 400,
        message: '缺少必要参数 qq_number 或 cookie',
      } as ApiResponse);
      return;
    }

    const account = await accountManager.addAccount(qq_number, cookie);

    // 脱敏返回
    const maskedAccount = {
      ...account,
      qqNumber: accountManager.maskQqNumber(account.qqNumber),
    };

    res.json({
      code: 0,
      message: '添加成功',
      data: maskedAccount,
    } as ApiResponse<AccountInfo>);
  } catch (error) {
    logger.error(`添加账号失败: ${error}`);
    res.status(400).json({
      code: 400,
      message: error instanceof Error ? error.message : '添加失败',
    } as ApiResponse);
  }
});

/** 获取账号列表 */
router.get('/', (req: Request, res: Response) => {
  const accounts = accountManager.getAllAccounts();
  const maskedAccounts = accounts.map(a => ({
    ...a,
    qqNumber: accountManager.maskQqNumber(a.qqNumber),
  }));

  res.json({
    code: 0,
    message: 'ok',
    data: maskedAccounts,
  } as ApiResponse<AccountInfo[]>);
});

/** 更新 Cookie */
router.put('/:id/cookie', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const { cookie } = req.body;

    if (!cookie) {
      res.status(400).json({
        code: 400,
        message: '缺少 cookie 参数',
      } as ApiResponse);
      return;
    }

    const account = await accountManager.updateCookie(id, cookie);
    if (!account) {
      res.status(404).json({
        code: 404,
        message: '账号不存在',
      } as ApiResponse);
      return;
    }

    res.json({
      code: 0,
      message: 'Cookie 更新成功',
      data: { ...account, qqNumber: accountManager.maskQqNumber(account.qqNumber) },
    } as ApiResponse<AccountInfo>);
  } catch (error) {
    logger.error(`更新 Cookie 失败: ${error}`);
    res.status(400).json({
      code: 400,
      message: error instanceof Error ? error.message : '更新失败',
    } as ApiResponse);
  }
});

/** 删除账号 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const deleted = await accountManager.deleteAccount(id);

    if (!deleted) {
      res.status(404).json({
        code: 404,
        message: '账号不存在',
      } as ApiResponse);
      return;
    }

    res.json({ code: 0, message: '删除成功' } as ApiResponse);
  } catch (error) {
    logger.error(`删除账号失败: ${error}`);
    res.status(500).json({
      code: 500,
      message: '删除失败',
    } as ApiResponse);
  }
});

/** 启用/禁用账号 */
router.patch('/:id/status', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const { status } = req.body;

    if (!['active', 'disabled'].includes(status)) {
      res.status(400).json({
        code: 400,
        message: 'status 必须为 active 或 disabled',
      } as ApiResponse);
      return;
    }

    const account = accountManager.setAccountStatus(id, status);
    if (!account) {
      res.status(404).json({
        code: 404,
        message: '账号不存在',
      } as ApiResponse);
      return;
    }

    res.json({
      code: 0,
      message: '状态更新成功',
      data: { ...account, qqNumber: accountManager.maskQqNumber(account.qqNumber) },
    } as ApiResponse<AccountInfo>);
  } catch (error) {
    logger.error(`更新状态失败: ${error}`);
    res.status(500).json({
      code: 500,
      message: '更新失败',
    } as ApiResponse);
  }
});

export default router;