import { ActivityInfo, ActivityType, ActivitySource } from '../../types';

/** 活动注册表 - 记录已知活动的页面结构 */
const ACTIVITY_REGISTRY: Map<string, Partial<ActivityInfo>> = new Map();

export class ActivityRegistry {
  /** 根据 URL 查找注册的活动信息 */
  findByUrl(url: string): Partial<ActivityInfo> | undefined {
    for (const [, activity] of ACTIVITY_REGISTRY) {
      if (activity.url === url) return activity;
    }
    return undefined;
  }

  /** 根据 ID 查找注册的活动信息 */
  findById(id: string): Partial<ActivityInfo> | undefined {
    return ACTIVITY_REGISTRY.get(id);
  }

  /** 添加新活动到注册表 */
  register(activity: Partial<ActivityInfo>): void {
    const key = activity.id || `custom-${Date.now()}`;
    ACTIVITY_REGISTRY.set(key, activity);
  }

  /** 获取所有已注册活动 */
  getAll(): Partial<ActivityInfo>[] {
    return Array.from(ACTIVITY_REGISTRY.values());
  }

  /** 清空注册表 */
  clear(): void {
    ACTIVITY_REGISTRY.clear();
  }
}

export const activityRegistry = new ActivityRegistry();