import { BaseTask } from './base-task';
import { COMMON_SELECTORS } from '../../utils/selector-helper';
import { logger } from '../../utils/logger';

export class ClaimRewardTask extends BaseTask {
  protected async preCheck(): Promise<void> {
    // 检查是否已领取过该奖励
  }

  protected async performAction(): Promise<string[]> {
    const page = await this.context.newPage();
    const rewards: string[] = [];
    try {
      await page.goto(this.activity.url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(2000);

      // 查找所有可领取按钮
      const claimButtons = await page.$$(
        '.btn-claim:not(.disabled):not(.done), ' +
        '.btn-receive:not(.disabled):not(.done), ' +
        '[class*="领取"]:not(.disabled)'
      );

      for (const btn of claimButtons) {
        try {
          const rewardName = await btn.evaluate(el => {
            return el.closest('.reward-item, .gift-item')
              ?.querySelector('.name, .title')
              ?.textContent?.trim() || '未知奖励';
          });

          await btn.click();
          await page.waitForTimeout(1500);
          await this.closePopup(page);
          rewards.push(rewardName);
        } catch {
          continue;
        }
      }

      if (rewards.length === 0) {
        throw new Error('没有可领取的奖励');
      }

      logger.info(`活动 ${this.activity.name} 领取奖励: ${rewards.join(', ')}`);
      return rewards;
    } finally {
      await page.close();
    }
  }

  protected async postVerify(): Promise<void> {
    // 可选：检查游戏内邮件/暂存箱
  }
}