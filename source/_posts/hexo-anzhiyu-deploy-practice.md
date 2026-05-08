---
title: Hexo 与安知鱼主题完整部署实践
date: 2026-04-22 18:00:00

cover: /img/covers/posts/hexo-anzhiyu-deploy.png

categories:
  - 博客部署

tags:
  - Hexo
  - 安知鱼

description: 基于 Hexo 与安知鱼主题，记录博客从本地开发、主题配置到 Nginx 与 HTTPS 部署的完整实践流程。
---

> 本文基于 Hexo 与安知鱼主题官方文档，并结合个人部署过程中的实际问题进行了二次整理与补充。

# 一、Hexo 与安知鱼主题简介

## Hexo

Hexo 是基于 Node.js 的静态博客框架，支持 Markdown 写作与静态页面生成，适合个人博客与技术站点。

官方链接：

- Hexo 官网：https://hexo.io/zh-cn/
- GitHub：https://github.com/hexojs/hexo

## 安知鱼主题

安知鱼主题是基于 Butterfly 深度定制的 Hexo 主题，提供首页卡片、动态背景、文章美化、评论系统等完整博客功能。

官方链接：

- 安知鱼官网：https://blog.anheyu.com/
- GitHub：https://github.com/anzhiyu-c/hexo-theme-anzhiyu
- 官方文档：https://docs.anheyu.com/

# 二、安装必要环境

## 安装 Node.js

Node.js 是 Hexo 运行所需环境，推荐安装 LTS 版本。

官方下载：

https://nodejs.org/zh-cn

安装完成后验证：

```powershell
node -v
npm -v
```

如果成功输出版本号，说明 Node.js 已安装完成。

## 安装 Git

Git 用于管理 Hexo 项目与主题文件。

官方下载：

https://git-scm.com/downloads

安装完成后验证：

```powershell
git -v
```

## 安装 Hexo CLI

```powershell
npm install -g hexo-cli
```

验证：

```powershell
hexo -v
```

# 三、本地初始化 Hexo

本文以 Windows 本地环境为例。

## 创建项目目录

在 D 盘创建博客目录：

```powershell
D:
mkdir blog
cd blog
```

## 初始化 Hexo 项目

```powershell
hexo init my-blog
cd my-blog
npm install
```

初始化完成后，项目目录会自动生成：

```text
my-blog
├── _config.yml
├── package.json
├── source
├── themes
└── scaffolds
```

## 启动本地服务

执行以下命令：

```powershell
hexo clean
hexo generate
hexo server
```

浏览器访问：

```text
http://localhost:4000
```

如果成功显示 Hexo 默认页面，则说明 Hexo 已安装成功。

# 四、安装安知鱼主题

## 下载安知鱼主题

在 Hexo 项目根目录执行：

```powershell
git clone -b main https://github.com/anzhiyu-c/hexo-theme-anzhiyu.git themes/anzhiyu
```

## 修改主题配置

打开项目根目录下的 `_config.yml`。

找到：

```yaml
theme: landscape
```

修改为：

```yaml
theme: anzhiyu
```

## 安装主题依赖

执行：

```powershell
npm install hexo-renderer-pug hexo-renderer-stylus --save
```

推荐额外安装：

```powershell
npm install hexo-generator-searchdb --save
```

用于后续配置本地搜索功能。

# 五、验证主题是否生效

重新生成静态文件：

```powershell
hexo clean
hexo generate
hexo server
```

浏览器访问：

```text
http://localhost:4000
```

如果页面已经显示安知鱼主题首页，则说明主题已经安装成功。

# 六、常见问题

## hexo 不是内部命令

原因：

- Hexo CLI 未正确安装
- PowerShell 环境变量未刷新

解决：

```powershell
npm install -g hexo-cli
```

重新打开 PowerShell 后再次执行：

```powershell
hexo -v
```

---

## localhost:4000 无法访问

原因：

- 4000 端口被占用
- 本地服务未正常启动

解决：

```powershell
hexo server -p 5000
```

然后访问：

```text
http://localhost:5000
```

---

## YAMLException duplicated mapping key

原因：

- `_config.yml`
- `_config.anzhiyu.yml`

中存在重复字段。

解决：

- 删除重复配置
- 检查 YAML 缩进
- YAML 文件统一使用 2 空格缩进

---

## Error: Cannot find module

原因：

- 缺少依赖包
- node_modules 未正确安装

解决：

```powershell
npm install
```

---

## 安知鱼主题未生效

原因：

- `_config.yml` 中主题名称错误
- 未执行重新生成命令

解决：

确认：

```yaml
theme: anzhiyu
```

然后重新执行：

```powershell
hexo clean
hexo generate
hexo server
```

# 七、后续配置与优化

安知鱼主题提供了完整的基础与进阶配置文档，包括首页布局、导航栏、评论系统、动态背景、页面美化等内容。

本文主要记录基础部署流程，其余配置建议结合官方文档进行个性化调整。

官方文档：

- 安知鱼主题官网：
  https://blog.anheyu.com/

- 安知鱼主题 GitHub：
  https://github.com/anzhiyu-c/hexo-theme-anzhiyu

- 安知鱼主题文档：
  https://docs.anheyu.com/

官方文档内已经包含：

- 基础配置教程
- 页面配置
- 首页卡片
- 导航栏设置
- 评论系统
- Twikoo 配置
- 动态背景
- 图床配置
- 自定义样式
- 进阶魔改
