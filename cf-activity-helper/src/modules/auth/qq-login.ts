import { BrowserContext } from 'playwright';
import { cookieStore } from './cookie-store';
import { COOKIE_DOMAINS } from '../../config/constants';
import { logger } from '../../utils/logger';

export class QQLogin {
  /**
   * 通过 Cookie 注入实现登录
   */
  async loginWithCookie(context: BrowserContext, accountId: string): Promise<boolean> {
    const cookies = await cookieStore.load(accountId);
    if (!cookies) {
      logger.warn(`账号 ${accountId} 无可用 Cookie，需要扫码登录`);
      return false;
    }

    if (!cookieStore.isCookieValid(cookies)) {
      logger.warn(`账号 ${accountId} Cookie 已过期`);
      return false;
    }

    // 注入 Cookie 到域名
    await context.addCookies(
      cookies.map(c => ({
        ...c,
        domain: c.domain || '.qq.com',
        sameSite: 'Lax' as const,
      }))
    );

    // 验证登录态
    const page = await context.newPage();
    try {
      await page.goto('https://cf.qq.com/', { waitUntil: 'networkidle', timeout: 30000 });
      const isLoggedIn = await page.evaluate(() => {
        return document.cookie.includes('p_skey') &&
               document.cookie.includes('p_uin');
      });
      logger.info(`账号 ${accountId} Cookie 登录${isLoggedIn ? '成功' : '失败'}`);
      return isLoggedIn;
    } catch (error) {
      logger.error(`账号 ${accountId} Cookie 登录验证异常: ${error}`);
      return false;
    } finally {
      await page.close();
    }
  }

  /**
   * QR 码扫码登录（备用方案）
   */
  async loginWithQR(context: BrowserContext, accountId: string): Promise<boolean> {
    const page = await context.newPage();
    try {
      await page.goto('https://cf.qq.com/', { waitUntil: 'networkidle' });

      const loginBtn = await page.$('.login-btn, [data-login]');
      if (loginBtn) {
        await loginBtn.click();
      }

      await page.waitForSelector('#qrcode img, .qr-code img', { timeout: 10000 });

      const qrElement = await page.$('#qrcode img, .qr-code img');
      if (qrElement) {
        const qrBuffer = await qrElement.screenshot();
        const qrBase64 = qrBuffer.toString('base64');
        logger.info(`账号 ${accountId} 请扫描 QR 码登录（Base64 已输出）`);
        // 实际部署中可通过 API 返回 QR 码图片给前端
      }

      await page.waitForNavigation({ timeout: 120000 });

      const cookies = await context.cookies();
      await cookieStore.save(accountId, cookies);
      logger.info(`账号 ${accountId} QR 码登录成功，Cookie 已保存`);
      return true;
    } catch (error) {
      logger.error(`账号 ${accountId} QR 码登录失败: ${error}`);
      return false;
    } finally {
      await page.close();
    }
  }
}

export const qqLogin = new QQLogin();