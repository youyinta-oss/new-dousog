import { config } from '../../config';
import { logger } from '../../utils/logger';

export interface NotifyMessage {
  title: string;
  content: string;
  level?: 'info' | 'warning' | 'error';
}

export class WebhookNotifier {
  /**
   * 发送 Webhook 通知（企业微信/钉钉）
   */
  async send(message: NotifyMessage): Promise<boolean> {
    if (!config.webhookUrl) {
      logger.debug('Webhook URL 未配置，跳过通知');
      return false;
    }

    try {
      const body = this.formatMessage(message);
      const response = await fetch(config.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        logger.error(`Webhook 发送失败: ${response.status}`);
        return false;
      }

      logger.debug(`Webhook 通知发送成功: ${message.title}`);
      return true;
    } catch (error) {
      logger.error(`Webhook 发送异常: ${error}`);
      return false;
    }
  }

  /**
   * 根据平台格式化消息
   */
  private formatMessage(message: NotifyMessage): object {
    // 企业微信格式
    if (config.webhookUrl.includes('qyapi.weixin.qq.com')) {
      return {
        msgtype: 'markdown',
        markdown: {
          content: `## ${message.title}\n\n${message.content}`,
        },
      };
    }

    // 钉钉格式
    if (config.webhookUrl.includes('dingtalk')) {
      return {
        msgtype: 'markdown',
        markdown: {
          title: message.title,
          text: `## ${message.title}\n\n${message.content}`,
        },
      };
    }

    // 默认 JSON 格式
    return {
      title: message.title,
      content: message.content,
      level: message.level || 'info',
    };
  }
}

export const webhookNotifier = new WebhookNotifier();