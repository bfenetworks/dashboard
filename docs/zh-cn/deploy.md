# 本文描述如何获取BFE Dashboard产出和部署

## 获取 BFE Dashboard 产出

产出的获取有多种方式
- 方式一：通过源码编译： clone [bfenetwork/dashboard](https://github.com/bfenetworks/dashboard) 仓库后进入项目根目录，执行 `sh build.sh`， output 文件夹就是静态文件
- 方式二：直接进入 [dashboard/releases](https://github.com/bfenetworks/dashboard/releases) 页面下载相应的编译产出


若想进行二次开发或者提交PR，请参考 [项目开发指南](./develop.md)。

## BFE Dashboard 部署
BFE Dashboard 依赖 [BFE API Server](https://github.com/bfenetworks/api-server)。部署Dashboard 之前应该完成 API Server的部署，详见[API Server 部署](https://github.com/bfenetworks/api-server/blob/develop/docs/zh_cn/deploy.md)。


生产环境具体部署步骤为：将编译产出放入 API Server的静态文件夹中。
