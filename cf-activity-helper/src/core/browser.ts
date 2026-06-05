import { chromium, Browser, BrowserContext } from 'playwright';
import { getRandomUA, getViewportForUA, ANTI_DETECT_SCRIPT } from '../../utils/anti-detect';
import { config } from '../../config';
import { logger } from '../../utils/logger';

class BrowserManager {
  private browser: Browser | null = null;
  private contexts: Map<string, BrowserContext> = new Map();

  async launch(): Promise<void> {
    if (this.browser) return;

    const launchOptions = {
      headless: true,
      args: [
        '--disable-blink-features=AutomationControlled',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    };

    if (config.proxyUrl) {
      launchOptions['proxy'] = { server: config.proxyUrl };
    }

    this.browser = await chromium.launch(launchOptions);
    logger.info('浏览器实例已启动');
  }

  async createContext(accountId: string): Promise<BrowserContext> {
    if (!this.browser) {
      await this.launch();
    }

    const ua = getRandomUA();
    const viewport = getViewportForUA(ua);

    const context = await this.browser!.newContext({
      userAgent: ua,
      viewport,
      locale: 'zh-CN',
      timezoneId: 'Asia/Shanghai',
    });

    await context.addInitScript(ANTI_DETECT_SCRIPT);

    this.contexts.set(accountId, context);
    logger.debug(`为账号 ${accountId} 创建浏览器上下文`);
    return context;
  }

  async getContext(accountId: string): Promise<BrowserContext> {
    if (!this.contexts.has(accountId)) {
      return this.createContext(accountId);
    }
    return this.contexts.get(accountId)!;
  }

  async closeContext(accountId: string): Promise<void> {
    const ctx = this.contexts.get(accountId);
    if (ctx) {
      await ctx.close();
      this.contexts.delete(accountId);
      logger.debug(`关闭账号 ${accountId} 的浏览器上下文`);
    }
  }

  async close(): Promise<void> {
    for (const [, ctx] of this.contexts) {
      await ctx.close();
    }
    await this.browser?.close();
    this.browser = null;
    this.contexts.clear();
    logger.info('浏览器实例已关闭');
  }

  isRunning(): boolean {
    return this.browser !== null;
  }
}

export const browserManager = new BrowserManager();