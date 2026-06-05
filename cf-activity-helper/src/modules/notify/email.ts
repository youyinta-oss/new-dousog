import { config } from '../../config';
import { logger } from '../../utils/logger';
import { NotifyMessage } from './webhook';

export class EmailNotifier {
  /**
   * 发送邮件通知
   * 注意：需要配置 SMTP 信息，使用 nodemailer 或类似库
   * 当前为简化实现，仅记录日志
   */
  async send(to: string, message: NotifyMessage): Promise<boolean> {
    if (!config.emailSmtpHost || !config.emailUser) {
      logger.debug('邮件 SMTP 未配置，跳过邮件通知');
      return false;
    }

    // TODO: 接入 nodemailer 发送邮件
    logger.info(`邮件通知 → ${to}: [${message.title}] ${message.content}`);
    return true;
  }
}

export const emailNotifier = new EmailNotifier();