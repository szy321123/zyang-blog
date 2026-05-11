---
title: OpenClaw（一键部署小龙虾）实战记录：快速完成安装与模型配置
date: 2026-05-11 21:30:00
tags:
  - OpenClaw
  - AI Agent
categories:
  - Linux运维
cover: /img/covers/posts/cover8.webp
description: 使用 openclawctl 一键部署 OpenClaw（小龙虾），记录安装、运行、API 配置与模型接入过程。
keywords: OpenClaw,AI Agent
top_img: false
---

最近重新部署了一次 OpenClaw。

相比之前手动配置 Node.js、daemon 和运行环境，现在使用 `openclawctl` 已经简单很多，基本可以直接一键完成部署。

项目地址：

- OpenClaw 官方仓库：https://github.com/openclaw/openclaw
- openclawctl 一键脚本：https://github.com/byJoey/openclawctl

---

## 安装前准备

系统建议：

```text
Debian 12 / Ubuntu 22.04+
```

先更新系统：

```bash
apt update && apt upgrade -y
```

安装基础依赖：

```bash
apt install curl git -y
```

OpenClaw 基于 Node.js 运行。

如果系统没有 Node.js，可以直接安装：

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install nodejs -y
```

相关链接：

- Node.js：https://nodejs.org/
- curl：https://curl.se/
- Git：https://git-scm.com/

---

## 一键安装 OpenClaw

直接执行：

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/byJoey/openclawctl/main/openclaw.sh)
```

脚本会自动完成环境检测、依赖安装、OpenClaw 下载和初始化配置。

安装完成后会进入 `openclawctl` 管理菜单，后续可以通过菜单完成启动、停止、更新和日志查看等操作。

---

## 启动 OpenClaw

安装完成后，可以直接启动 Gateway：

```bash
openclaw gateway
```

如果需要后台运行，建议安装 daemon 服务：

```bash
openclaw onboard --install-daemon
```

后台模式会注册系统服务，SSH 断开后 OpenClaw 也会继续运行。

查看运行状态：

```bash
openclaw gateway status
```

如果状态正常，说明 OpenClaw 已经成功启动。

---

## 配置 API 与模型

OpenClaw 本身是 Agent 框架，真正的模型能力需要通过 API 接入。

配置文件位置一般在：

```bash
~/.openclaw/openclaw.json
```

编辑配置文件：

```bash
nano ~/.openclaw/openclaw.json
```

---

## 使用 OpenRouter 接入模型

这里推荐使用 OpenRouter。

它的优势是模型选择比较多，可以统一接入 Claude、GPT、Gemini、DeepSeek 等模型，并且配置方式相对简单。

官网：

https://openrouter.ai/

登录 OpenRouter 后，在后台创建 API Key，然后写入 OpenClaw 配置文件。

示例配置：

```json
{
  "provider": {
    "openrouter": {
      "apiKey": "你的APIKEY"
    }
  },
  "agent": {
    "model": "openrouter/deepseek/deepseek-chat"
  }
}
```

其中：

```text
apiKey
```

填写你自己的 OpenRouter API Key。

```text
model
```

填写你想使用的模型 ID。

---

## 推荐模型

| 模型 | 说明 |
| --- | --- |
| deepseek-chat | 适合日常使用，成本较低 |
| claude-3.7-sonnet | 综合能力较强，适合复杂任务 |
| gpt-4.1 | 稳定性较高，通用能力强 |
| gemini-2.5-pro | 长上下文表现不错 |

如果只是测试和日常使用，可以先从 DeepSeek 或 OpenRouter 免费模型开始。

---

## Web 控制台

OpenClaw 也提供 Dashboard 控制台。

启动命令：

```bash
openclaw dashboard
```

默认地址：

```text
127.0.0.1:18789
```

如果部署在 VPS 上，需要开放端口：

```bash
ufw allow 18789/tcp
```

不过更推荐通过 Nginx 反向代理访问。

例如：

```text
claw.example.com
```

反代到：

```text
127.0.0.1:18789
```

如果域名托管在 Cloudflare，可以配合 HTTPS 使用，访问体验会更好，也不需要直接暴露服务器端口。

---

## 常见问题

### curl: command not found

说明系统没有安装 curl。

执行：

```bash
apt install curl -y
```

然后重新运行一键安装命令。

---

### openclaw.json 不存在

如果出现配置文件不存在，通常是初始化没有完成。

可以重新执行：

```bash
openclaw onboard
```

完成初始化后再检查：

```bash
ls ~/.openclaw/
```

---

### Feishu 模块报错

如果出现：

```bash
Cannot find module '@larksuiteoapi/node-sdk'
```

一般是飞书扩展依赖缺失。

可以执行：

```bash
npm install @larksuiteoapi/node-sdk
```

如果依旧报错，建议重新执行 `openclawctl` 安装脚本，让脚本重新检查依赖。

---

## 总结

`openclawctl` 的意义在于把 OpenClaw 的安装、初始化和服务管理整合到了一起。

对于只是想快速部署 OpenClaw 的用户来说，不需要手动处理太多 Node.js 环境和 daemon 配置，直接通过一键脚本完成安装会更省事。

如果你的目标是搭建一个自托管 AI 助手，或者把 OpenClaw 接入 Telegram、OpenRouter、Claude、GPT 等模型服务，这套方式已经足够作为基础部署方案。
