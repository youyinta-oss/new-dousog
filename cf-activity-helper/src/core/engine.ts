import { BrowserContext } from 'playwright';
import { browserManager } from './browser';
import { qqLogin } from '../modules/auth/qq-login';
import { activityCrawler } from '../modules/activity/crawler';
import { activityRepo } from '../db/repositories/activity.repo';
import { recordRepo } from '../db/repositories/record.repo';
import { accountRepo } from '../db/repositories/account.repo';
import { SignInTask } from '../modules/tasks/sign-in';
import { ClaimRewardTask } from '../modules/tasks/claim-reward';
import { LotteryTask } from '../modules/tasks/lottery';
import { ShareTask } from '../modules/tasks/share-task';
import { BaseTask } from '../modules/tasks/base-task';
import { TaskResult, ActivityInfo, ActivityType, EngineStatus } from '../types';
import { webhookNotifier } from '../modules/notify/webhook';
import { logger } from '../utils/logger';
import { randomDelay } from '../utils/anti-detect';
import { v4 as uuidv4 } from 'uuid';

export class CoreEngine {
  private running = false;
  private currentTaskId: string | undefined;
  private totalAccounts = 0;
  private completedAccounts = 0;
  private startTime: string | undefined;

  /**
   * 为单个账号执行所有活动领取
   */
  async runForAccount(accountId: string, accountIdDb: number): Promise<TaskResult[]> {
    logger.info(`开始为账号 ${accountId} 执行活动领取`);

    // 1. 初始化浏览器上下文
    const context = await browserManager.getContext(accountId);

    // 2. 登录
    const loggedIn = await qqLogin.loginWithCookie(context, accountId);
    if (!loggedIn) {
      logger.error(`账号 ${accountId} 登录失败，跳过`);
      accountRepo.updateCookieValid(accountIdDb, false);
      return [];
    }

    accountRepo.updateCookieValid(accountIdDb, true);

    // 3. 获取活动列表
    const page = await context.newPage();
    let activities: Partial<ActivityInfo>[] = [];
    try {
      activities = await activityCrawler.scanBangCenter(page);
      logger.info(`账号 ${accountId} 发现 ${activities.length} 个活动`);
    } catch (error) {
      logger.error(`账号 ${accountId} 活动扫描失败: ${error}`);
    }
    await page.close();

    // 4. 保存活动到数据库
    for (const activity of activities) {
      if (activity.url && activity.name) {
        const id = this.generateActivityId(activity.url);
        activityRepo.upsert({
          id,
          name: activity.name!,
          url: activity.url!,
          type: activity.type || ActivityType.CLAIM_REWARD,
          source: activity.source!,
          status: activity.status || 'active',
        });
      }
    }

    // 5. 获取数据库中的活跃活动
    const dbActivities = activityRepo.getActive();

    // 6. 逐个执行活动任务
    const results: TaskResult[] = [];
    for (const activity of dbActivities) {
      try {
        const task = this.createTask(context, activity);
        if (!task) continue;

        const result = await task.execute();
        results.push(result);

        // 保存记录
        recordRepo.save({
          accountId: accountIdDb,
          activityId: activity.id,
          success: result.success,
          message: result.message,
          rewards: result.rewards || [],
        });

        // 任务间隔
        await randomDelay(2000, 5000);
      } catch (error) {
        logger.error(`活动 ${activity.name} 执行异常: ${error}`);
      }
    }

    // 7. 清理
    await browserManager.closeContext(accountId);
    return results;
  }

  /**
   * 为多个账号执行领取
   */
  async runForAccounts(accountIds: number[]): Promise<{ taskId: string; results: Map<number, TaskResult[]> }> {
    const taskId = uuidv4();
    this.running = true;
    this.currentTaskId = taskId;
    this.totalAccounts = accountIds.length;
    this.completedAccounts = 0;
    this.startTime = new Date().toISOString();

    logger.info(`任务 ${taskId} 开始，共 ${accountIds.length} 个账号`);

    const results = new Map<number, TaskResult[]>();

    for (const accountIdDb of accountIds) {
      const account = accountRepo.getById(accountIdDb);
      if (!account || account.status !== 'active') {
        logger.warn(`账号 ID ${accountIdDb} 不存在或已禁用，跳过`);
        continue;
      }

      try {
        const accountResults = await this.runForAccount(account.qqNumber, accountIdDb);
        results.set(accountIdDb, accountResults);
      } catch (error) {
        logger.error(`账号 ${account.qqNumber} 执行失败: ${error}`);
      }

      this.completedAccounts++;
    }

    // 发送通知
    const successCount = Array.from(results.values())
      .flat()
      .filter(r => r.success).length;
    const failCount = Array.from(results.values())
      .flat()
      .filter(r => !r.success).length;

    await webhookNotifier.send({
      title: 'CF 活动领取完成',
      content: `任务 ID: ${taskId}\n账号数: ${accountIds.length}\n成功: ${successCount}\n失败: ${failCount}`,
    });

    this.running = false;
    this.currentTaskId = undefined;

    logger.info(`任务 ${taskId} 完成`);
    return { taskId, results };
  }

  /**
   * 获取引擎状态
   */
  getStatus(): EngineStatus {
    return {
      running: this.running,
      currentTaskId: this.currentTaskId,
      totalAccounts: this.totalAccounts,
      completedAccounts: this.completedAccounts,
      startTime: this.startTime,
    };
  }

  /**
   * 根据活动类型创建对应的任务实例
   */
  private createTask(context: BrowserContext, activity: ActivityInfo): BaseTask | null {
    switch (activity.type) {
      case ActivityType.SIGN_IN:
        return new SignInTask(context, activity);
      case ActivityType.CLAIM_REWARD:
        return new ClaimRewardTask(context, activity);
      case ActivityType.LOTTERY:
        return new LotteryTask(context, activity);
      case ActivityType.SHARE:
      case ActivityType.BROWSE:
        return new ShareTask(context, activity);
      default:
        logger.warn(`不支持的活动类型: ${activity.type}`);
        return null;
    }
  }

  /**
   * 生成活动 ID
   */
  private generateActivityId(url: string): string {
    let hash = 0;
    for (let i = 0; i < url.length; i++) {
      const char = url.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }
}

export const coreEngine = new CoreEngine();