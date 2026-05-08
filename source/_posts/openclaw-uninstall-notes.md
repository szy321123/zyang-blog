---
title: OpenClaw 卸载记录
date: 2026-04-27 15:00:00

cover: /img/covers/posts/openclaw-complete-uninstall-guide.png

categories:
  - OpenClaw

tags:
  - OpenClaw
  - VPS

description: 记录 OpenClaw 在 VPS 环境中的卸载与清理过程，包括 Gateway、systemd 服务与配置残留的处理方式。
---

> 本文基于个人 VPS 使用过程进行了整理，部分命令参考 OpenClaw 官方项目。

# 一、为什么整理这篇文章

最近在整理 VPS 环境时，准备把之前部署的 OpenClaw 完整移除。

实际卸载过程中发现，仅删除 CLI 并不会自动清理 Gateway、systemd 服务与相关配置，部分服务在重启后还会自动恢复，因此顺手把整个卸载流程记录了下来。

目前主要环境：

- Debian 12
- Docker
- systemd
- VPS 远程环境

# 二、先确认安装方式

不同安装方式，对应的卸载方式也不同。

## 查看是否为 CLI 安装

```bash
which openclaw && openclaw --version
```

## 查看是否为 Docker 部署

```bash
docker ps -a | grep openclaw
```

## 查看是否为源码部署

```bash
ls ~/openclaw 2>/dev/null
```

如果以上都没有输出，可以直接全局搜索：

```bash
find / -name "openclaw" 2>/dev/null | head
```

# 三、我目前的卸载顺序

实际卸载时，建议按以下顺序操作：

```text
停止 Gateway
    ↓
删除启动服务
    ↓
清理配置与工作区
    ↓
卸载 CLI
    ↓
检查残留
```

# 四、停止 Gateway

```bash
openclaw gateway stop
```

如果 Gateway 仍在运行：

```bash
ps aux | grep openclaw
```

# 五、删除启动服务

```bash
openclaw gateway uninstall
```

查看服务：

```bash
systemctl --user list-units | grep openclaw
```

禁用服务：

```bash
systemctl --user disable --now openclaw-gateway.service
```

删除配置：

```bash
rm -f ~/.config/systemd/user/openclaw-gateway.service
```

刷新 systemd：

```bash
systemctl --user daemon-reload
```

# 六、清理配置与工作区

```bash
rm -rf ~/.openclaw
```

如果使用过多个 profile：

```bash
rm -rf ~/.openclaw-*
```

工作区也会一起删除：

```bash
rm -rf ~/.openclaw/workspace
```

备份工作区：

```bash
cp -r ~/.openclaw/workspace ~/backup_workspace
```

# 七、卸载 CLI

## npm

```bash
npm rm -g openclaw
```

## pnpm

```bash
pnpm remove -g openclaw
```

## bun

```bash
bun remove -g openclaw
```

## Homebrew

```bash
brew uninstall openclaw-cli
```

# 八、Docker 部署的清理方式

查看容器：

```bash
docker ps -a | grep openclaw
```

删除容器：

```bash
docker rm -f $(docker ps -a | grep openclaw | awk '{print $1}')
```

删除镜像：

```bash
docker rmi $(docker images | grep openclaw | awk '{print $3}')
```

# 九、最后检查残留

检查进程：

```bash
ps aux | grep openclaw | grep -v grep
```

检查端口：

```bash
ss -lptn | grep openclaw
```

检查 systemd：

```bash
systemctl --user list-units-files | grep openclaw
```

检查目录：

```bash
ls -la ~/.openclaw
```

# 十、一些实际遇到的问题

## Gateway 无法关闭

通常是 systemd 服务仍在运行：

```bash
systemctl --user disable --now openclaw-gateway.service
```

## 删除后服务又自动恢复

建议检查：

```bash
~/.config/systemd/user/
```

## Docker 镜像无法删除

通常是容器仍在运行，建议先删除容器。

# 十一、使用建议

如果只是临时测试 OpenClaw，更建议优先使用 Docker 部署。

相比直接安装到系统环境：

- 更容易卸载
- 不容易污染系统
- 清理更方便
- 更适合 VPS 测试环境
