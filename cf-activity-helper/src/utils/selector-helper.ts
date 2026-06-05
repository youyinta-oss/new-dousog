import { Page, ElementHandle } from 'playwright';

/**
 * 多选择器回退查找元素
 */
export async function findElement(
  page: Page,
  selectors: string[]
): Promise<ElementHandle<HTMLElement | SVGElement> | null> {
  for (const selector of selectors) {
    try {
      const element = await page.$(selector);
      if (element) {
        const isVisible = await element.isVisible();
        if (isVisible) {
          return element as ElementHandle<HTMLElement | SVGElement>;
        }
      }
    } catch {
      continue;
    }
  }
  return null;
}

/**
 * 尝试点击多个选择器中的第一个可用元素
 */
export async function tryClick(page: Page, selectors: string[]): Promise<boolean> {
  const element = await findElement(page, selectors);
  if (element) {
    await element.click();
    return true;
  }
  return false;
}

/** 常用选择器库 */
export const COMMON_SELECTORS = {
  claimButtons: [
    '.btn-claim', '.btn-receive', '.btn-draw',
    '[class*="claim"]', '[class*="receive"]', '[class*="draw"]',
    '.reward-btn', '.gift-btn', '.get-btn',
  ],

  signInButtons: [
    '.sign-btn', '.btn-sign', '.checkin-btn',
    '[class*="sign-in"]', '[class*="checkin"]',
    '.daily-sign', '#signBtn',
  ],

  closeButtons: [
    '.close-btn', '.modal-close', '.dialog-close',
    '[class*="close"]', '.btn-close', '#closeBtn',
    '.mask', '.overlay',
  ],

  loginButtons: [
    '.login-btn', '[class*="login"]', '[data-login]',
    '.btn-login', '#loginBtn',
  ],

  lotteryButtons: [
    '.lottery-btn', '.btn-lottery', '.draw-btn',
    '[class*="lottery"]', '[class*="抽奖"]', '#lotteryBtn',
  ],

  shareButtons: [
    '.share-btn', '.btn-share', '[class*="share"]',
    '[class*="分享"]', '#shareBtn',
  ],
};