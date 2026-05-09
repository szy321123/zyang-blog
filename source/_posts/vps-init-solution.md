---
title: 我目前的 VPS 初始化方案
date: 2026-04-24 04:15:00

cover: /img/covers/posts/cover6.webp

categories:
  - Linux运维

tags:
  - Linux
  - VPS

description: 记录目前用于 VPS 环境初始化的一套常用工具与配置流程，包括 Docker、SSL 与基础运维脚本。
---

> 本文基于个人 VPS 使用过程进行了整理与补充，部分命令参考 Kejilion.sh 官方项目。

# 一、为什么开始使用这套方案

最近在整理 VPS 环境时，为了减少重复安装 Docker、Nginx 与 SSL 的时间，开始尝试使用 Kejilion.sh 作为基础运维工具。

相比传统手动配置方式，这类脚本更适合：

- 新 VPS 初始化
- Docker 环境部署
- HTTPS 配置
- 临时测试环境
- 轻量博客服务

目前主要配合：

- Debian 12
- Docker
- Cloudflare
- Nginx

一起使用。

# 二、Kejilion.sh 项目

Kejilion.sh 是一个 Linux 运维脚本集合，集成了 Docker、LDNMP、SSL、WARP、FRP 等常用功能。

项目地址：

- 官网：https://kejilion.sh
- GitHub：https://github.com/kejilion/sh

# 三、安装前准备

部分 Linux 系统默认未安装 curl，需要先安装。

## Debian / Ubuntu

```bash
apt update -y && apt install -y curl
```

## CentOS / AlmaLinux / Rocky Linux

```bash
yum install -y curl
```

## Alpine

```bash
apk add curl
```

安装完成后验证：

```bash
curl --version
```

如果成功输出版本信息，则说明 curl 已安装完成。

# 四、启动脚本

执行以下命令：

```bash
bash <(curl -sL kejilion.sh)
```

首次启动后会进入交互式菜单。

目前支持：

- Debian
- Ubuntu
- CentOS
- Alpine
- Kali
- Arch

等主流 Linux 发行版。

# 五、我目前常用的功能

这里只整理目前实际使用频率较高的功能。

## Docker 环境初始化

```bash
bash <(curl -sL kejilion.sh) en docker install
```

主要用于：

- Docker 安装
- 容器环境初始化
- 临时服务部署

安装完成后验证：

```bash
docker -v
```

---

## Nginx 反向代理

```bash
bash <(curl -sL kejilion.sh) en fd
```

目前主要用于：

- 面板反代
- Docker 服务转发
- HTTPS 网站配置

使用前建议确认：

- 域名已经解析到 VPS
- 防火墙已开放 80 与 443 端口

---

## SSL 证书申请

```bash
bash <(curl -sL kejilion.sh) en ssl
```

申请前建议确认：

- 域名已完成 DNS 解析
- Cloudflare 已关闭代理模式（首次申请建议关闭）
- 80 端口未被占用

---

## BBR 网络加速

```bash
bash <(curl -sL kejilion.sh) en bbr3
```

适用于：

- 海外 VPS 网络优化
- TCP 加速
- 下载速度优化

部分系统开启后需要重启服务器。

# 六、常见问题

## curl: command not found

原因：

- 系统未安装 curl

解决：

```bash
apt install -y curl
```

---

## Docker 安装失败

原因：

- 系统版本过低
- Docker 源异常
- VPS 网络问题

建议：

- 优先使用 Debian 12
- 检查网络连接
- 避免在过旧系统运行脚本

---

## SSL 申请失败

原因：

- DNS 未解析
- Cloudflare 代理开启
- 80 端口被占用

解决：

- 检查域名解析
- 临时关闭 Cloudflare 小黄云
- 确认 nginx 未冲突

---

## SSH 连接异常

部分网络相关功能可能影响当前 SSH 连接。

例如：

- WARP
- BBR
- DD 重装
- 网络调优

建议优先在测试环境使用。

---

## DD 重装风险

执行：

```bash
bash <(curl -sL kejilion.sh) en dd
```

会清空当前服务器全部数据。

操作前建议：

- 提前备份数据
- 确认 VPS 支持 VNC
- 保留 SSH 密钥

# 七、使用建议

目前这套方案更适合作为：

- VPS 初始化工具
- Docker 快速部署工具
- 轻量服务运维脚本

对于个人博客与轻量服务场景，可以减少大量重复环境配置操作。

部分网络与系统相关功能建议谨慎使用，避免影响当前服务器环境。
