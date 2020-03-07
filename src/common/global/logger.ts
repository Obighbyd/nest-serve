import { Logger as LoggerSource } from '@nestjs/common';
import log4js from 'log4js';
import { getIp } from '../tool';
import { join } from 'path';

class Logger extends LoggerSource {
  log4js: log4js.Logger;

  constructor() {
    super();
    log4js.configure({
      appenders: {
        cheese: {
          type: 'dateFile',
          filename: join(__dirname, '../../../logs/server.log'),
          // 配置 layout，此处使用自定义模式 pattern
          layout: {
            type: 'pattern',
            pattern: '%d [%p] %m',
          },
          // 日志文件按日期（天）切割
          pattern: 'yyyy-MM-dd',
          // 回滚旧的日志文件时，保证以 .log 结尾 （只有在 alwaysIncludePattern 为 false 生效）
          keepFileExt: true,
          // 输出的日志文件名是都始终包含 pattern 日期结尾
          alwaysIncludePattern: true,
          // 指定日志保留的天数
          daysToKeep: 10,
        },
      },
      categories: {
        default: {
          appenders: ['cheese'],
          level: 'all',
        },
      },
    });

    this.log4js = log4js.getLogger();
  }

  log(message: any, trace: string) {
    super.log(message, trace);
    this.log4js.info(trace, message);
  }

  error(message: any, trace: string) {
    super.log(message, trace);
    this.log4js.error(trace, message);
  }

  warn(message: any, trace: string) {
    super.log(message, trace);
    this.log4js.warn(trace, message);
  }

  debug(message: any, trace: string) {
    super.log(message, trace);
    this.log4js.debug(trace, message);
  }

  verbose(message: any, trace: string) {
    super.log(message, trace);
    this.log4js.info(trace, message);
  }

  /**
   * 打印请求
   */
  request(req: any) {
    const { method, url, user, body } = req;
    this.log(url, `${getIp(req)} ${method}`);
    user?.username && this.log(user?.username, '用户名');
    Object.keys(body).length && this.log(body, '请求参数');
  }
}

/**
 * 日志
 */
export const logger = new Logger();