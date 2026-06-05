import { accountRepo } from '../../db/repositories/account.repo';
import { cookieStore } from '../auth/cookie-store';
import { AccountInfo } from '../../types';
import { logger } from '../../utils/logger';

export class AccountManager {
  /**
   * 添加账号（QQ号 + Cookie 字符串）
   */
  async addAccount(qqNumber: string, cookieStr: string): Promise<AccountInfo> {
    // 检查是否已存在
    const existing = accountRepo.getByQqNumber(qqNumber);
    if (existing) {
      throw new Error(`账号 ${qqNumber} 已存在`);
    }

    // 解析并保存 Cookie
    const cookies = cookieStore.parseCookieString(cookieStr);
    const isValid = cookieStore.isCookieValid(cookies);

    if (!isValid) {
      logger.warn(`账号 ${qqNumber} Cookie 格式无效或缺少必要字段`);
    }

    await cookieStore.save(qqNumber, cookies);

    // 创建账号记录
    const account = accountRepo.add(qqNumber, '', isValid);
    logger.info(`添加账号 ${qqNumber}，Cookie ${isValid ? '有效' : '无效'}`);
    return account;
  }

  /**
   * 更新账号 Cookie
   */
  async updateCookie(accountId: number, cookieStr: string): Promise<AccountInfo> {
    const account = accountRepo.getById(accountId);
    if (!account) {
      throw new Error(`账号 ID ${accountId} 不存在`);
    }

    const cookies = cookieStore.parseCookieString(cookieStr);
    const isValid = cookieStore.isCookieValid(cookies);

    await cookieStore.save(account.qqNumber, cookies);
    accountRepo.updateCookieValid(accountId, isValid);

    logger.info(`更新账号 ${account.qqNumber} Cookie，${isValid ? '有效' : '无效'}`);
    return accountRepo.getById(accountId)!;
  }

  /**
   * 删除账号
   */
  async deleteAccount(accountId: number): Promise<boolean> {
    const account = accountRepo.getById(accountId);
    if (!account) return false;

    await cookieStore.delete(account.qqNumber);
    const deleted = accountRepo.delete(accountId);
    if (deleted) {
      logger.info(`删除账号 ${account.qqNumber}`);
    }
    return deleted;
  }

  /**
   * 获取所有账号
   */
  getAllAccounts(): AccountInfo[] {
    return accountRepo.getAll();
  }

  /**
   * 获取活跃账号
   */
  getActiveAccounts(): AccountInfo[] {
    return accountRepo.getActiveAccounts();
  }

  /**
   * 启用/禁用账号
   */
  setAccountStatus(accountId: number, status: 'active' | 'disabled'): AccountInfo | undefined {
    accountRepo.updateStatus(accountId, status);
    return accountRepo.getById(accountId);
  }

  /**
   * QQ 号脱敏
   */
  maskQqNumber(qqNumber: string): string {
    if (qqNumber.length <= 4) return qqNumber;
    const start = qqNumber.slice(0, 3);
    const end = qqNumber.slice(-3);
    return `${start}****${end}`;
  }
}

export const accountManager = new AccountManager();