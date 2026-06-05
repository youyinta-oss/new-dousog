import { BrowserContext, Page } from 'playwright';
import { ActivityInfo, TaskResult } from '../../types';
import { COMMON_SELECTORS } from '../../utils/selector-helper';
import { randomDelay } from '../../utils/anti-detect';

/** 任务基类 */
export abstract class BaseTask {
  protected context: BrowserContext;
  protected activity: ActivityInfo;

  constructor(context: BrowserContext, activity: ActivityInfo) {
    this.context = context;
    this.activity = activity;
  }

  /** 执行任务（模板方法） */
  async execute(): Promise<TaskResult> {
    const startTime = Date.now();
    try {
      await this.preCheck();
      const rewards = await this.performAction();
      await this.postVerify();

      return {
        success: true,
        activityId: this.activity.id,
        activityName: this.activity.name,
        message: `领取成功 (${Date.now() - startTime}ms)`,
        rewards,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        activityId: this.activity.id,
        activityName: this.activity.name,
        message: `领取失败: ${error instanceof Error ? error.message : String(error)}`,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /** 前置检查 */
  protected abstract preCheck(): Promise<void>;

  /** 执行具体领取操作 */
  protected abstract performAction(): Promise<string[]>;

  /** 后置验证 */
  protected abstract postVerify(): Promise<void>;

  /** 关闭可能出现的弹窗 */
  protected async closePopup(page: Page): Promise<void> {
    for (const selector of COMMON_SELECTORS.closeButtons) {
      const closeBtn = await page.$(selector);
      if (closeBtn) {
        await closeBtn.click().catch(() => {});
        await page.waitForTimeout(500);
      }
    }
  }
}