---
title: OpenClaw 接入 QQ 与微信记录
date: 2026-04-29 22:30:00

cover: /img/covers/posts/cover4.webp

categories:
  - OpenClaw

tags:
  - OpenClaw
  - QQ

description: 记录目前 OpenClaw 在 QQ 机器人与微信环境中的接入过程，包括插件安装、消息通道配置与实际遇到的问题。
---

> 本文基于个人 VPS 使用过程进行了整理，部分内容参考 OpenClaw 官方插件与社区文档。

# 一、为什么开始接入消息通道

最近在折腾 OpenClaw 时，开始尝试把消息入口接到 QQ 与微信。

相比只在 CLI 或 WebUI 中使用，接入消息通道后会更适合：

- 日常消息交互
- 群聊测试
- 移动端使用
- VPS 长期运行

目前主要环境：

- Debian 12
- Docker
- OpenClaw Gateway
- Cloudflare
- QQ 机器人

# 二、我目前的接入方式

目前主要使用：

- QQ 机器人
- 微信个人号

其中 QQ 机器人使用频率更高。

原因：

- 群聊支持更完整
- 稳定性更好
- 多设备兼容更方便

微信目前更多用于个人测试。

# 三、QQ 机器人接入

## 创建 QQ 机器人

QQ 开放平台：

https://q.qq.com/

创建后需要保存：

- AppID
- AppSecret
- Bot Token

## 安装 QQ 插件

```bash
openclaw plugins install @sliverp/qqbot@latest
```

验证：

```bash
openclaw plugins list | grep qqbot
```

## 添加消息通道

```bash
openclaw channels add --channel qqbot --token "你的Token"
```

重启 Gateway：

```bash
openclaw gateway restart
```

查看状态：

```bash
openclaw gateway status
```

# 四、QQ 接入时遇到的问题

## 插件安装失败

切换 npm 源：

```bash
npm config set registry https://registry.npmmirror.com
```

## Token 不生效

检查通道：

```bash
openclaw channels list
```

检查 Gateway：

```bash
openclaw gateway status
```

## 无法接收消息

查看公网 IP：

```bash
curl -s https://api.ipify.org
```

然后配置 QQ 白名单。

# 五、微信接入

## 安装 pnpm

```bash
npm install -g pnpm
```

## 安装微信插件

```bash
pnpm -y @tencent-weixin/openclaw-weixin-cli@latest install
```

## 扫码登录

执行后终端会显示二维码。

成功后会显示：

```text
[INFO] WeChat connection established successfully
```

# 六、微信接入时遇到的问题

## 二维码无法显示

建议优先使用：

- FinalShell
- Xshell
- Termius

## 扫码后环境异常

可以尝试：

- 更换 VPS IP
- 更新微信版本
- 切换网络

## 微信掉线

重新执行：

```bash
pnpm -y @tencent-weixin/openclaw-weixin-cli@latest install
```

# 七、Gateway 与日志排查

查看 Gateway：

```bash
openclaw gateway status
```

查看日志：

```bash
openclaw logs --tail 100
```

手动启动：

```bash
openclaw gateway start
```

重启 Gateway：

```bash
openclaw gateway restart
```

# 八、我目前的使用习惯

目前个人更倾向于：

- QQ 作为主要消息入口
- 微信用于移动端测试
- OpenClaw 部署在 Docker 环境

相比直接在服务器终端交互：

- 日常使用更方便
- 更适合长期运行
- 更适合移动端使用

不过目前消息通道相关插件更新频率比较快，偶尔也会出现兼容性问题，建议优先在测试环境使用。
