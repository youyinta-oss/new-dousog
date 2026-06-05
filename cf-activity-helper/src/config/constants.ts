/** CF 活动页面来源域名 */
export const ACTIVITY_DOMAINS = {
  CF_OFFICIAL: 'cf.qq.com',
  DAOJU: 'act.daoju.qq.com',
  BANG: 'bang.qq.com',
};

/** 活动中心 URL */
export const ACTIVITY_CENTER_URL = 'https://bang.qq.com/actcenter/index/cf/';

/** CF 官网首页 */
export const CF_HOME_URL = 'https://cf.qq.com/';

/** QQ 登录相关 Cookie 字段 */
export const REQUIRED_COOKIE_KEYS = ['p_skey', 'p_uin', 'skey', 'uin'];

/** Cookie 有效域名 */
export const COOKIE_DOMAINS = ['.qq.com', 'cf.qq.com', 'act.daoju.qq.com', 'bang.qq.com'];

/** 默认请求超时（毫秒） */
export const DEFAULT_TIMEOUT = 30000;

/** 页面加载等待超时 */
export const PAGE_LOAD_TIMEOUT = 30000;

/** 操作间隔范围（毫秒） */
export const ACTION_DELAY = { min: 2000, max: 5000 };
