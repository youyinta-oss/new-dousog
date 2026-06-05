import { BaseTask } from './base-task';
import { COMMON_SELECTORS } from '../../utils/selector-helper';
import { logger } from '../../utils/logger';

export class LotteryTask extends BaseTask {
  private maxAttempts: number = 3;

  protected async preCheck(): Promise<void> {
    // 检查抽奖次数是否用完
  }

  protected async performAction(): Promise<string[]> {
    const page = await this.context.newPage();
    const rewards: string[] = [];
    try {
      await page.goto(this.activity.url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(2000);

      for (let i = 0; i < this.maxAttempts; i++) {
        // 尝试多种抽奖按钮选择器
        let clicked = false;
        for (const selector of COMMON_SELECTORS.lotteryButtons) {
          const btn = await page.$(selector);
          if (btn) {
            const isDisabled = await btn.getAttribute('disabled');
            if (isDisabled) {
              return rewards.length > 0 ? rewards : ['抽奖次数已用完'];
            }
            await btn.click();
            clicked = true;
            break;
          }
        }

        if (!clicked) {
          throw new Error('未找到抽奖按钮');
        }

        // 等待抽奖结果
        await page.waitForTimeout(3000);

        // 尝试获取奖励名称
        try {
          const rewardEl = await page.$('.prize-name, .reward-text, .lottery-result');
          if (rewardEl) {
            const name = await rewardEl.textContent();
            if (name?.trim()) {
              rewards.push(name.trim());
            }
          }
        } catch {
          rewards.push('奖励 x1');
        }

        await this.closePopup(page);
        await page.waitForTimeout(1000);
      }

      logger.info(`活动 ${this.activity.name} 抽奖完成，获得: ${rewards.join(', ')}`);
      return rewards;
    } finally {
      await page.close();
    }
  }

  protected async postVerify(): Promise<void> {
    // 验证抽奖次数已更新
  }
}