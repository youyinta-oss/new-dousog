import { Page } from 'playwright';
import { BaseTask } from './base-task';
import { COMMON_SELECTORS } from '../../utils/selector-helper';
import { logger } from '../../utils/logger';

export class SignInTask extends BaseTask {
  protected async preCheck(): Promise<void> {
    // 检查今天是否已签到（可查询数据库记录）
  }

  protected async performAction(): Promise<string[]> {
    const page = await this.context.newPage();
    try {
      await page.goto(this.activity.url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(2000);

      // 尝试多种签到按钮选择器
      for (const selector of COMMON_SELECTORS.signInButtons) {
        const btn = await page.$(selector);
        if (btn) {
          const isDisabled = await btn.getAttribute('disabled');
          const classList = await btn.getAttribute('class');

          if (isDisabled || classList?.includes('disabled') || classList?.includes('done')) {
            return ['今日已签到'];
          }

          await btn.click();
          await page.waitForTimeout(1500);
          await this.closePopup(page);
          logger.info(`活动 ${this.activity.name} 签到成功`);
          return ['签到成功'];
        }
      }

      throw new Error('未找到签到按钮');
    } finally {
      await page.close();
    }
  }

  protected async postVerify(): Promise<void> {
    // 验证签到状态已更新
  }
}