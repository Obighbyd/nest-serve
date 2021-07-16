import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from '../logger';
import { rootPath } from '@app/public-tool';
import { join } from 'path';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import { merge } from 'lodash';

export interface GlobalModuleOptions {
  yamlFilePath?: string[]; // 配置文件路径
}

/**
 * 全局模块
 */
@Module({})
export class GlobalModule {
  /**
   * 全局模块初始化
   */
  static forRoot(options: GlobalModuleOptions): DynamicModule {
    const { yamlFilePath = [] } = options || {};
    return {
      module: GlobalModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          cache: true,
          load: [
            () => {
              let configs: any = {};
              const configPath = ['config.yaml', `${process.env.NODE_ENV || 'development'}.yaml`, ...yamlFilePath];
              for (let path of configPath) {
                try {
                  // 读取并解析配置文件
                  configs = merge(configs, load(readFileSync(join(rootPath, 'config', path), 'utf8')));
                } catch {}
              }
              return configs;
            },
          ],
        }),
        LoggerModule.forRoot({
          isGlobal: true,
          useFactory: (configService: ConfigService) => {
            const path = configService.get('path.log');
            return { filename: join(rootPath, `logs/${path}/${path}.log`) };
          },
          inject: [ConfigService],
        }),
      ],
    };
  }
}
