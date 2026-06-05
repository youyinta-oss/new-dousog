import { Page } from 'playwright';
import { ActivityInfo, ActivitySource, ActivityType } from '../../types';
import { logger } from '../../utils/logger';

export class ActivityCrawler {
  /**
   * 扫描帮帮活动中心，获取活动列表
   */
  async scanBangCenter(page: Page): Promise<Partial<ActivityInfo>[]> {
    await page.goto('https://bang.qq.com/actcenter/index/cf/', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    const activities = await page.evaluate(() => {
      const items = document.querySelectorAll('.act-item, .activity-item, .item');
      return Array.from(items).map(item => {
        const link = item.querySelector('a');
        const title = item.querySelector('.title, .name, h3, h4');
        const tag = item.querySelector('.tag, .label, .type');
        return {
          name: title?.textContent?.trim() || '',
          url: (link as HTMLAnchorElement)?.href || '',
          tags: tag?.textContent?.trim() || '',
        };
      }).filter(a => a.url && a.name);
    });

    return activities.map(a => ({
      name: a.name,
      url: a.url,
      source: ActivitySource.BANG,
      type: this.inferActivityType(a.tags, a.url),
      status: 'active',
    }));
  }

  /**
   * 解析单个活动页面
   */
  async parseActivityPage(page: Page, url: string): Promise<Partial<ActivityInfo> | null> {
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

      const pageInfo = await page.evaluate(() => {
        return {
          title: document.title,
          hasClaimBtn: !!document.querySelector(
            '[class*="claim"], [class*="receive"], [class*="draw"], ' +
            '[class*="sign"], [class*="lottery"], .btn-claim, .btn-receive'
          ),
          hasLoginPrompt: !!document.querySelector(
            '[class*="login"], .login-btn, [data-login]'
          ),
        };
      });

      return {
        name: pageInfo.title,
        url,
        type: this.inferActivityType('', url),
        status: 'active',
      };
    } catch (error) {
      logger.error(`解析活动页面失败 ${url}: ${error}`);
      return null;
    }
  }

  /**
   * 根据活动标签和 URL 推断活动类型
   */
  private inferActivityType(tags: string, url: string): ActivityType {
    const combined = `${tags} ${url}`.toLowerCase();

    if (combined.includes('签到') || combined.includes('sign') || combined.includes('每日')) {
      return ActivityType.SIGN_IN;
    }
    if (combined.includes('抽奖') || combined.includes('lottery') || combined.includes('夺宝')) {
      return ActivityType.LOTTERY;
    }
    if (combined.includes('分享') || combined.includes('share')) {
      return ActivityType.SHARE;
    }
    if (combined.includes('兑换') || combined.includes('exchange') || combined.includes('cdk')) {
      return ActivityType.CODE_EXCHANGE;
    }
    return ActivityType.CLAIM_REWARD;
  }
}

export const activityCrawler = new ActivityCrawler();