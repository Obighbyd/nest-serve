# Nest Serve

使用 nestjs v8.x 进行重构，抽象更多公共模块到 libs，并把原有同质 lib 合并成一个

## 旧版本

- [使用 monorepo 模式开发](https://github.com/dyb881/nest-serve/tree/monorepo)
- [使用 multirepo 模式开发](https://github.com/dyb881/nest-serve/tree/multirepo)

## 基础服务

### 账号管理模块

优化账号体系，初步划分，每种账号都是单独的数据表，在业务上关联数据

- 超级管理员账号 - 最高权限可操作所有数据
- 合作商管理账号 - 最高权限可操作与当前合作商关联的数据
- 用户账号 - 仅可操作账号下的关联数据

### 文件管理模块

### 信息管理模块

## 网关服务

## 自定义库

- public-decorator 公共装饰器
- public-tool 公共工具库

## 如果觉得项目还不错，请打赏一波，您的支持是我最大的动力。

![二维码](https://files.bittyshow.top/pay.png)
