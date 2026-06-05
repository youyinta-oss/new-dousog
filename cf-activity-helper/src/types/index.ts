/** 活动类型枚举 */
export enum ActivityType {
  SIGN_IN = 'sign_in',
  CLAIM_REWARD = 'claim_reward',
  LOTTERY = 'lottery',
  SHARE = 'share',
  BROWSE = 'browse',
  CODE_EXCHANGE = 'code_exchange',
}

/** 活动来源 */
export enum ActivitySource {
  CF_OFFICIAL = 'cf_official',
  DAOJU = 'daoju',
  BANG = 'bang',
}

/** 活动操作步骤 */
export interface ActivityAction {
  type: 'click' | 'wait' | 'navigate' | 'evaluate';
  selector?: string;
  value?: string;
  timeout?: number;
  description: string;
}

/** 页面结构信息 */
export interface PageStructure {
  selectors: {
    loginBtn?: string;
    claimBtn?: string;
    signBtn?: string;
    lotteryBtn?: string;
    rewardList?: string;
    confirmBtn?: string;
    closeBtn?: string;
  };
  actions: ActivityAction[];
}

/** 活动信息 */
export interface ActivityInfo {
  id: string;
  name: string;
  url: string;
  type: ActivityType;
  source: ActivitySource;
  status: 'active' | 'expired' | 'unknown';
  startDate?: string;
  endDate?: string;
  rewards?: string[];
  lastChecked?: string;
  pageStructure?: PageStructure;
}

/** 任务执行结果 */
export interface TaskResult {
  success: boolean;
  activityId: string;
  activityName: string;
  message: string;
  rewards?: string[];
  screenshot?: string;
  timestamp: string;
}

/** 账号信息 */
export interface AccountInfo {
  id: number;
  qqNumber: string;
  nickname: string;
  cookieValid: boolean;
  status: 'active' | 'disabled';
  createdAt: string;
  updatedAt: string;
}

/** 领取记录 */
export interface ClaimRecord {
  id: number;
  accountId: number;
  activityId: string;
  success: boolean;
  message: string;
  rewards: string[];
  createdAt: string;
}

/** API 响应格式 */
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data?: T;
}

/** 引擎运行状态 */
export interface EngineStatus {
  running: boolean;
  currentTaskId?: string;
  totalAccounts?: number;
  completedAccounts?: number;
  startTime?: string;
}
