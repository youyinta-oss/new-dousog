import fs from 'fs/promises';
import path from 'path';
import { Cookie } from 'playwright';
import { config } from '../../config';
import { REQUIRED_COOKIE_KEYS } from '../../config/constants';
import { logger } from '../../utils/logger';

export class CookieStore {
  /**
   * 保存账号 Cookie 到文件
   */
  async save(accountId: string, cookies: Cookie[]): Promise<void> {
    await fs.mkdir(config.cookieDir, { recursive: true });
    await fs.writeFile(
      path.join(config.cookieDir, `${accountId}.json`),
      JSON.stringify(cookies, null, 2),
      'utf-8'
    );
    logger.debug(`账号 ${accountId} Cookie 已保存`);
  }

  /**
   * 加载账号 Cookie
   */
  async load(accountId: string): Promise<Cookie[] | null> {
    try {
      const data = await fs.readFile(
        path.join(config.cookieDir, `${accountId}.json`),
        'utf-8'
      );
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  /**
   * 删除账号 Cookie 文件
   */
  async delete(accountId: string): Promise<void> {
    try {
      await fs.unlink(path.join(config.cookieDir, `${accountId}.json`));
    } catch { /* ignore */ }
  }

  /**
   * 检查 Cookie 是否有效
   */
  isCookieValid(cookies: Cookie[]): boolean {
    const cookieMap = new Map(cookies.map(c => [c.name, c]));

    for (const key of REQUIRED_COOKIE_KEYS) {
      if (!cookieMap.has(key)) return false;
      const cookie = cookieMap.get(key)!;
      if (cookie.expires && cookie.expires > 0 && cookie.expires < Date.now() / 1000) {
        return false;
      }
    }
    return true;
  }

  /**
   * 将 Cookie 字符串解析为 Playwright Cookie 数组
   */
  parseCookieString(cookieStr: string, domain: string = '.qq.com'): Cookie[] {
    return cookieStr.split(';').map(pair => {
      const [name, ...valueParts] = pair.trim().split('=');
      const value = valueParts.join('=');
      return {
        name: name.trim(),
        value: value.trim(),
        domain,
        path: '/',
        expires: -1,
        httpOnly: false,
        secure: false,
        sameSite: 'Lax' as const,
      };
    }).filter(c => c.name && c.value);
  }
}

export const cookieStore = new CookieStore();