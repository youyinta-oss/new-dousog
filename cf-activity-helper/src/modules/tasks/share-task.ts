import { BaseTask } from './base-task';
import { COMMON_SELECTORS } from '../../utils/selector-helper';
import { logger } from '../../utils/logger';

export class ShareTask extends BaseTask {
  protected async preCheck(): Promise<void> {
    // 检查分享任务是否已完成
  }

  protected async performAction(): Promise<string[]> {
    const page = await this.context.newPage();
    try {
      await page.goto(this.activity.url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(2000);

      // 尝试多种分享按钮选择器
      for (const selector of COMMON_SELECTORS.shareButtons) {
        const btn = await page.$(selector);
        if (btn) {
          const isDisabled = await btn.getAttribute('disabled');
          const classList = await btn.getAttribute('class');

          if (isDisabled || classList?.includes('disabled') || classList?.includes('done')) {
            return ['分享任务已完成'];
          }

          // 模拟分享操作（点击按钮）
          await btn.click();
          await page.waitForTimeout(2000);

          // 尝试关闭分享弹窗
          await this.closePopup(page);

          logger.info(`活动 ${this.activity.name} 分享任务完成`);
          return ['分享任务完成'];
        }
      }

      // 如果没有分享按钮，尝试模拟浏览任务
      await this.simulateBrowse(page);
      return ['浏览任务完成'];
    } finally {
      await page.close();
    }
  }

  protected async postVerify(): Promise<void> {
    // 验证分享/浏览状态已更新
  }

  /** 模拟浏览任务 */
  private async simulateBrowse(page: import('playwright').Page): Promise<void> {
    // 模拟页面滚动
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight / 2);
    });
    await page.waitForTimeout(1000);
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(1000);
  }
}