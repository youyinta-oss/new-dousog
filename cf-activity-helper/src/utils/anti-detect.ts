/** User-Agent 池 */
const USER_AGENTS = {
  windows: [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  ],
  mac: [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
  ],
};

type Platform = keyof typeof USER_AGENTS;

export interface AntiDetectOptions {
  platform?: Platform;
}

/**
 * 获取随机 User-Agent
 */
export function getRandomUA(platform?: string): string {
  const key = (platform || (Math.random() > 0.6 ? 'mac' : 'windows')) as Platform;
  const pool = USER_AGENTS[key] || USER_AGENTS.windows;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * 获取与 UA 匹配的 viewport
 */
export function getViewportForUA(ua: string): { width: number; height: number } {
  if (ua.includes('Macintosh')) {
    return { width: 1440, height: 900 };
  }
  return { width: 1920, height: 1080 };
}

/**
 * 反检测初始化脚本
 * 注入到 BrowserContext 中隐藏自动化特征
 */
export const ANTI_DETECT_SCRIPT = `
  Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
  Object.defineProperty(navigator, 'languages', { get: () => ['zh-CN', 'zh', 'en'] });

  // 隐藏 Playwright/Puppeteer 特征
  delete window.__playwright;
  delete window.__pw_manual;

  // 伪装 Chrome 运行时
  window.chrome = { runtime: {} };

  // 覆盖 permissions API
  const originalQuery = window.navigator.permissions.query;
  window.navigator.permissions.query = (parameters) =>
    parameters.name === 'notifications'
      ? Promise.resolve({ state: Notification.permission })
      : originalQuery(parameters);
`;

/**
 * 随机延迟（模拟人工操作）
 */
export function randomDelay(minMs: number = 2000, maxMs: number = 5000): Promise<void> {
  const delay = Math.floor(Math.random() * (maxMs - minMs)) + minMs;
  return new Promise(resolve => setTimeout(resolve, delay));
}
