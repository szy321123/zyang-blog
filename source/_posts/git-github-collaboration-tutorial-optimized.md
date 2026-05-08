---
title: Git 与 GitHub 团队协作实战指南：分支管理、PR 审查与自动部署
date: 2026-04-23 12:00:00
cover: /img/covers/posts/git-github-collaboration-tutorial.png
categories:
  - 开发协作
tags:
  - Git
  - GitHub
description: 系统讲解 Git 与 GitHub 在团队协作中的完整使用流程，覆盖基础配置、分支管理、远程仓库、Pull Request、Code Review、冲突处理、常见错误排查，以及 Hexo 博客自动部署实践。
---

# Git 与 GitHub 团队协作实战指南：分支管理、PR 审查与自动部署

> 本文面向需要使用 Git 与 GitHub 进行项目协作、代码管理和博客自动部署的用户。内容覆盖从本地仓库配置到团队协作流程，再到常见问题排查，适合作为日常开发与部署的操作手册。

## 目录

- [一、Git 与 GitHub 的核心关系](#一git-与-github-的核心关系)
- [二、Git 基础配置](#二git-基础配置)
- [三、本地仓库常用操作](#三本地仓库常用操作)
- [四、分支管理与合并策略](#四分支管理与合并策略)
- [五、远程仓库配置与同步](#五远程仓库配置与同步)
- [六、GitHub 团队协作流程](#六github-团队协作流程)
- [七、Pull Request 与 Code Review](#七pull-request-与-code-review)
- [八、冲突处理与回滚方案](#八冲突处理与回滚方案)
- [九、Hexo 博客自动部署实践](#九hexo-博客自动部署实践)
- [十、常见问题与解决方法](#十常见问题与解决方法)
- [十一、常用命令速查](#十一常用命令速查)

---

## 一、Git 与 GitHub 的核心关系

Git 是本地版本控制工具，负责记录代码变更、管理分支、回退版本和合并代码。GitHub 是远程代码托管平台，负责存放远程仓库，并提供 Pull Request、Code Review、Issues、Actions 等协作功能。

两者的关系可以理解为：

```text
本地代码目录
  ↓ git add
暂存区
  ↓ git commit
本地 Git 仓库
  ↓ git push
GitHub 远程仓库
  ↓ Pull Request / Code Review / Actions
团队协作与自动部署
```

### 1.1 Git 的三个工作区域

| 区域 | 作用 | 常用命令 |
|---|---|---|
| 工作区 | 当前正在编辑的文件目录 | `git status`、`git diff` |
| 暂存区 | 准备提交的文件快照 | `git add`、`git restore --staged` |
| 本地仓库 | 已提交的历史版本 | `git commit`、`git log` |
| 远程仓库 | GitHub 上的仓库副本 | `git push`、`git pull`、`git fetch` |

### 1.2 文件状态

Git 中常见的文件状态有三种：

| 状态 | 含义 |
|---|---|
| Modified | 文件已修改，但还没有加入暂存区 |
| Staged | 文件已加入暂存区，等待提交 |
| Committed | 文件已经提交到本地仓库 |

日常开发中的标准流程是：

```bash
git status
git add .
git commit -m "feat: add new feature"
git push
```

---

## 二、Git 基础配置

首次使用 Git 前，建议先完成全局配置，避免后续提交记录中出现错误用户名或邮箱。

### 2.1 安装 Git

Debian / Ubuntu：

```bash
sudo apt update
sudo apt install git -y
```

CentOS / Rocky Linux / AlmaLinux：

```bash
sudo dnf install git -y
```

macOS：

```bash
git --version
```

Windows 用户建议安装 Git for Windows，安装完成后使用 Git Bash 执行命令。

### 2.2 配置用户名和邮箱

```bash
git config --global user.name "Your Name"
git config --global user.email "your_email@example.com"
```

查看配置：

```bash
git config --list
git config user.name
git config user.email
```

如果某个项目需要单独配置身份，可以在该项目目录下执行：

```bash
git config --local user.name "Project Name"
git config --local user.email "project@example.com"
```

### 2.3 设置默认分支名

```bash
git config --global init.defaultBranch main
```

这样以后执行 `git init` 时，默认分支会使用 `main`。

### 2.4 配置 SSH 连接 GitHub

推荐使用 SSH 连接 GitHub，避免每次推送代码都输入账号密码。

生成 SSH 密钥：

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

一路回车即可。如果你想给密钥设置密码，可以在提示输入 passphrase 时填写；如果只是个人电脑使用，也可以直接回车跳过。

查看公钥：

```bash
cat ~/.ssh/id_ed25519.pub
```

然后进入 GitHub：

```text
GitHub → Settings → SSH and GPG keys → New SSH key
```

填写说明：

| 项目 | 填写内容 |
|---|---|
| Title | 自定义名称，例如 My Laptop |
| Key | 粘贴 `id_ed25519.pub` 里的完整内容 |

测试连接：

```bash
ssh -T git@github.com
```

成功时会看到类似提示：

```text
Hi username! You've successfully authenticated, but GitHub does not provide shell access.
```

---

## 三、本地仓库常用操作

### 3.1 初始化仓库

在项目目录中执行：

```bash
git init
```

如果是已有远程项目，直接克隆：

```bash
git clone git@github.com:username/repository.git
```

HTTPS 方式也可以：

```bash
git clone https://github.com/username/repository.git
```

SSH 更适合长期使用；HTTPS 更适合临时下载或没有配置 SSH 的环境。

### 3.2 查看当前状态

```bash
git status
```

简洁模式：

```bash
git status -s
```

常见状态说明：

| 标记 | 含义 |
|---|---|
| `M` | 文件已修改 |
| `A` | 新增文件 |
| `D` | 删除文件 |
| `??` | 未被 Git 跟踪的新文件 |

### 3.3 查看修改内容

查看工作区修改：

```bash
git diff
```

查看某个文件的修改：

```bash
git diff filename.md
```

查看已经加入暂存区、即将提交的内容：

```bash
git diff --staged
```

只查看修改统计：

```bash
git diff --stat
```

### 3.4 暂存文件

暂存指定文件：

```bash
git add filename.md
```

暂存所有修改：

```bash
git add .
```

暂存所有修改，包括删除的文件：

```bash
git add -A
```

分块暂存：

```bash
git add -p
```

`git add -p` 适合一个文件里有多处修改，但你只想提交其中一部分的情况。

### 3.5 提交代码

```bash
git commit -m "feat: add user login page"
```

推荐使用清晰的提交信息，常见格式如下：

| 类型 | 用途 |
|---|---|
| `feat` | 新功能 |
| `fix` | 修复问题 |
| `docs` | 文档修改 |
| `style` | 代码格式调整 |
| `refactor` | 代码重构 |
| `chore` | 构建、依赖、配置修改 |

示例：

```bash
git commit -m "docs: update deployment guide"
git commit -m "fix: correct nginx config path"
git commit -m "feat: add article cover layout"
```

### 3.6 查看提交历史

```bash
git log
```

简洁模式：

```bash
git log --oneline
```

查看分支图：

```bash
git log --oneline --graph --all
```

查看某个文件的历史：

```bash
git log -- filename.md
```

---

## 四、分支管理与合并策略

分支用于隔离不同任务，避免直接修改主分支。团队协作时，不建议所有人直接在 `main` 分支开发。

### 4.1 创建分支

```bash
git switch -c feature/login-page
```

旧版本 Git 可以使用：

```bash
git checkout -b feature/login-page
```

建议分支命名清晰：

| 类型 | 示例 | 说明 |
|---|---|---|
| 功能分支 | `feature/login-page` | 开发新功能 |
| 修复分支 | `fix/nginx-502` | 修复问题 |
| 文档分支 | `docs/git-guide` | 修改文档 |
| 发布分支 | `release/v1.0.0` | 发布准备 |

### 4.2 查看分支

查看本地分支：

```bash
git branch
```

查看本地和远程分支：

```bash
git branch -a
```

查看分支跟踪关系：

```bash
git branch -vv
```

### 4.3 切换分支

```bash
git switch main
git switch feature/login-page
```

切回上一个分支：

```bash
git switch -
```

### 4.4 合并分支

先切回目标分支：

```bash
git switch main
```

拉取最新代码：

```bash
git pull origin main
```

合并功能分支：

```bash
git merge feature/login-page
```

如果合并完成后不再需要功能分支，可以删除：

```bash
git branch -d feature/login-page
```

如果分支尚未合并但确认不需要，可以强制删除：

```bash
git branch -D feature/login-page
```

### 4.5 Merge 与 Rebase 的区别

| 方式 | 特点 | 适用场景 |
|---|---|---|
| Merge | 保留分支合并记录 | 团队公共分支 |
| Rebase | 让提交历史更线性 | 整理个人功能分支 |

合并方式：

```bash
git switch main
git merge feature/login-page
```

变基方式：

```bash
git switch feature/login-page
git rebase main
```

建议规则：

- 公共分支优先使用 `merge`。
- 个人分支可以使用 `rebase` 整理提交历史。
- 已经推送到远程并被他人使用的分支，不要随意 `rebase`。

### 4.6 暂存当前工作

如果你正在开发，但临时需要切换分支，可以使用 `stash`：

```bash
git stash push -m "WIP: login page"
```

查看暂存列表：

```bash
git stash list
```

恢复最近一次暂存：

```bash
git stash pop
```

只恢复但不删除暂存记录：

```bash
git stash apply
```

---

## 五、远程仓库配置与同步

### 5.1 添加远程仓库

```bash
git remote add origin git@github.com:username/repository.git
```

查看远程地址：

```bash
git remote -v
```

修改远程地址：

```bash
git remote set-url origin git@github.com:username/new-repository.git
```

删除远程仓库配置：

```bash
git remote remove origin
```

### 5.2 推送代码

首次推送：

```bash
git push -u origin main
```

后续推送：

```bash
git push
```

推送指定分支：

```bash
git push origin feature/login-page
```

删除远程分支：

```bash
git push origin --delete feature/login-page
```

### 5.3 拉取远程更新

拉取并合并：

```bash
git pull origin main
```

只获取远程更新，不自动合并：

```bash
git fetch origin
```

如果你想先查看远程更新内容，建议使用：

```bash
git fetch origin
git log --oneline main..origin/main
```

确认后再合并：

```bash
git merge origin/main
```

---

## 六、GitHub 团队协作流程

推荐团队使用以下流程：

```text
1. 从 main 分支拉取最新代码
2. 创建功能分支
3. 在功能分支完成开发
4. 提交并推送到 GitHub
5. 创建 Pull Request
6. 团队成员 Code Review
7. 通过测试后合并到 main
8. 删除已合并分支
```

对应命令：

```bash
git switch main
git pull origin main

git switch -c feature/article-layout

# 修改代码后
git add .
git commit -m "feat: add article layout"
git push -u origin feature/article-layout
```

推送后，在 GitHub 页面创建 Pull Request。

### 6.1 Fork 协作流程

参与开源项目时，通常没有原仓库写权限，需要先 Fork：

```text
原项目仓库 → Fork 到自己的账号 → Clone 到本地 → 修改代码 → Push 到自己的仓库 → 向原项目提交 PR
```

克隆自己的 Fork：

```bash
git clone git@github.com:yourname/repository.git
cd repository
```

添加原项目作为上游仓库：

```bash
git remote add upstream git@github.com:original-owner/repository.git
```

同步原项目更新：

```bash
git fetch upstream
git switch main
git merge upstream/main
git push origin main
```

---

## 七、Pull Request 与 Code Review

Pull Request 是 GitHub 协作的核心。它的作用不是简单“合并代码”，而是让团队在合并前完成讨论、审查、测试和记录。

### 7.1 创建 Pull Request

在 GitHub 页面操作：

```text
Repository → Pull requests → New pull request
```

选择：

| 项目 | 说明 |
|---|---|
| base | 要合并到的目标分支，通常是 `main` |
| compare | 你的功能分支 |
| title | 用一句话说明本次改动 |
| description | 写清楚改动内容、影响范围、测试方式 |

### 7.2 推荐 PR 模板

在项目中创建文件：

```bash
mkdir -p .github
touch .github/pull_request_template.md
```

写入：

```markdown
## 改动说明

本次 PR 主要完成：

- 
- 

## 影响范围

- [ ] 页面样式
- [ ] 构建流程
- [ ] 后端接口
- [ ] 文档内容

## 测试方式

已完成以下测试：

- [ ] 本地运行通过
- [ ] 构建通过
- [ ] 页面展示正常

## 相关 Issue

Closes #
```

### 7.3 Code Review 重点

审查代码时重点看以下内容：

| 维度 | 检查点 |
|---|---|
| 功能正确性 | 是否满足需求，是否存在边界问题 |
| 代码可读性 | 命名是否清晰，结构是否合理 |
| 安全性 | 是否泄露密钥、Token、密码 |
| 可维护性 | 是否过度复杂，是否容易扩展 |
| 测试情况 | 是否经过本地测试或自动化测试 |
| 影响范围 | 是否影响已有功能 |

### 7.4 合并策略

GitHub 常见合并方式：

| 合并方式 | 说明 | 建议 |
|---|---|---|
| Merge commit | 保留完整分支历史 | 适合需要保留上下文的团队 |
| Squash and merge | 将多个提交压缩为一个 | 适合个人项目和文档项目 |
| Rebase and merge | 线性合并提交 | 适合追求干净历史的团队 |

个人博客、文档仓库、Hexo 项目建议使用 `Squash and merge`，提交历史更清晰。

---

## 八、冲突处理与回滚方案

### 8.1 为什么会冲突

当两个分支修改了同一文件的同一位置，Git 无法判断应该保留哪一份内容，就会产生冲突。

冲突文件通常长这样：

```text
<<<<<<< HEAD
当前分支的内容
=======
被合并分支的内容
>>>>>>> feature/login-page
```

### 8.2 解决冲突流程

先确保主分支是最新的：

```bash
git switch main
git pull origin main
```

切换回功能分支：

```bash
git switch feature/login-page
```

合并主分支：

```bash
git merge main
```

如果出现冲突，执行：

```bash
git status
```

找到冲突文件，手动编辑，删除以下标记：

```text
<<<<<<< HEAD
=======
>>>>>>> branch-name
```

保留最终需要的内容后，执行：

```bash
git add conflict-file.md
git commit -m "fix: resolve merge conflict"
git push
```

### 8.3 放弃本次合并

如果冲突太复杂，想恢复到合并前状态：

```bash
git merge --abort
```

如果是 rebase 过程中产生冲突：

```bash
git rebase --abort
```

### 8.4 撤销未提交修改

撤销某个文件的修改：

```bash
git restore filename.md
```

撤销所有未提交修改：

```bash
git restore .
```

取消暂存：

```bash
git restore --staged filename.md
```

### 8.5 回退已经提交的内容

撤销最近一次提交，但保留代码修改：

```bash
git reset --soft HEAD~1
```

撤销最近一次提交，修改回到工作区：

```bash
git reset --mixed HEAD~1
```

彻底回退最近一次提交并丢弃修改：

```bash
git reset --hard HEAD~1
```

安全撤销某次提交，保留历史记录：

```bash
git revert <commit-hash>
```

团队协作中更推荐 `git revert`，因为它不会重写公共提交历史。

### 8.6 使用 reflog 找回误删提交

如果误用了 `reset --hard`，可以用 `reflog` 找回：

```bash
git reflog
```

找到误删前的提交记录后执行：

```bash
git reset --hard <commit-hash>
```

---

## 九、Hexo 博客自动部署实践

Hexo 博客推荐使用 GitHub Actions 自动部署。流程是：

```text
本地写文章 → git push 到 GitHub → GitHub Actions 自动构建 → rsync 同步到 VPS → Nginx 直接访问 public 目录
```

这种方式适合静态博客，因为服务器不需要长期运行 `hexo server`，只需要让 Nginx 提供静态文件访问。

### 9.1 准备 GitHub 仓库

在 GitHub 创建博客源码仓库，例如：

```text
zyang-blog
```

本地关联远程仓库：

```bash
git remote add origin git@github.com:yourname/zyang-blog.git
git branch -M main
git push -u origin main
```

### 9.2 准备服务器目录

在 VPS 上创建网站目录：

```bash
sudo mkdir -p /var/www/zyang_blog
sudo chown -R $USER:$USER /var/www/zyang_blog
```

如果 Nginx 使用 `www-data` 用户访问，也可以设置：

```bash
sudo chown -R www-data:www-data /var/www/zyang_blog
```

### 9.3 配置 GitHub Secrets

进入 GitHub 仓库：

```text
Settings → Secrets and variables → Actions → New repository secret
```

添加：

| Secret 名称 | 说明 |
|---|---|
| `VPS_HOST` | VPS 的公网 IP |
| `VPS_USER` | SSH 用户名，例如 `root` 或 `deployer` |
| `VPS_SSH_KEY` | 用于登录 VPS 的私钥内容 |
| `VPS_PATH` | 网站目录，例如 `/var/www/zyang_blog/` |

查看本机私钥：

```bash
cat ~/.ssh/id_ed25519
```

注意：这里填写的是私钥，不是 `.pub` 公钥。

### 9.4 创建 GitHub Actions 工作流

在项目中创建：

```bash
mkdir -p .github/workflows
touch .github/workflows/deploy.yml
```

写入：

```yaml
name: Deploy Hexo Blog

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout source
        uses: actions/checkout@v4
        with:
          submodules: true
          fetch-depth: 1

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Build Hexo
        run: |
          npx hexo clean
          npx hexo generate
        env:
          TZ: Asia/Shanghai

      - name: Deploy to VPS
        uses: easingthemes/ssh-deploy@main
        env:
          SSH_PRIVATE_KEY: ${{ secrets.VPS_SSH_KEY }}
          REMOTE_HOST: ${{ secrets.VPS_HOST }}
          REMOTE_USER: ${{ secrets.VPS_USER }}
          SOURCE: "public/"
          TARGET: ${{ secrets.VPS_PATH }}
          ARGS: "-avz --delete"
```

提交并推送：

```bash
git add .github/workflows/deploy.yml
git commit -m "chore: add hexo deployment workflow"
git push
```

然后进入 GitHub 仓库的 Actions 页面查看部署日志。

### 9.5 Nginx 静态站点配置示例

```nginx
server {
    listen 80;
    server_name zyang.me www.zyang.me;

    root /var/www/zyang_blog;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    access_log /var/log/nginx/zyang_blog.access.log;
    error_log /var/log/nginx/zyang_blog.error.log;
}
```

检查配置：

```bash
sudo nginx -t
```

重载 Nginx：

```bash
sudo systemctl reload nginx
```

---

## 十、常见问题与解决方法

### 10.1 `Permission denied (publickey)`

问题原因：

- GitHub 没有添加 SSH 公钥
- 当前机器没有对应私钥
- 使用了错误的远程地址
- SSH agent 没有加载密钥

解决方法：

```bash
ssh -T git@github.com
```

检查远程地址：

```bash
git remote -v
```

如果是 HTTPS，可以改成 SSH：

```bash
git remote set-url origin git@github.com:username/repository.git
```

加载密钥：

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

### 10.2 `fatal: remote origin already exists`

说明当前仓库已经存在 `origin`。

查看：

```bash
git remote -v
```

修改地址：

```bash
git remote set-url origin git@github.com:username/repository.git
```

或者删除后重新添加：

```bash
git remote remove origin
git remote add origin git@github.com:username/repository.git
```

### 10.3 `Updates were rejected because the remote contains work`

说明远程仓库有本地没有的提交。

先拉取：

```bash
git pull origin main
```

如果有冲突，解决冲突后再推送：

```bash
git add .
git commit -m "fix: resolve pull conflict"
git push
```

如果你确认远程内容可以被覆盖，才使用强制推送：

```bash
git push -f origin main
```

团队项目不建议随意使用 `git push -f`。

### 10.4 `fatal: refusing to merge unrelated histories`

常见于本地仓库和远程仓库分别初始化过，历史记录不一致。

解决：

```bash
git pull origin main --allow-unrelated-histories
```

如果出现冲突，手动解决后提交。

### 10.5 GitHub Actions 部署失败：`Permission denied`

常见原因：

- `VPS_SSH_KEY` 填成了公钥
- 私钥格式不完整
- VPS 没有添加对应公钥
- 服务器用户没有目标目录写权限

检查服务器是否能使用该密钥登录：

```bash
ssh -i ~/.ssh/id_ed25519 root@your_vps_ip
```

检查目录权限：

```bash
ls -ld /var/www/zyang_blog
```

修复权限：

```bash
sudo chown -R root:root /var/www/zyang_blog
sudo chmod -R 755 /var/www/zyang_blog
```

如果使用普通部署用户：

```bash
sudo chown -R deployer:deployer /var/www/zyang_blog
```

### 10.6 GitHub Actions 构建失败：`npm ci` 报错

原因通常是：

- 没有提交 `package-lock.json`
- `package.json` 和 `package-lock.json` 不一致
- Node.js 版本不兼容

解决方法：

```bash
npm install
git add package.json package-lock.json
git commit -m "chore: update dependencies lockfile"
git push
```

如果项目没有 `package-lock.json`，可以把 workflow 中的：

```yaml
run: npm ci
```

改成：

```yaml
run: npm install
```

### 10.7 Hexo 构建后页面没有更新

检查顺序：

1. GitHub Actions 是否成功运行
2. `public/` 是否正确生成
3. VPS 目标目录是否正确
4. Nginx root 是否指向正确目录
5. Cloudflare 是否缓存旧页面

清理 Hexo：

```bash
npx hexo clean
npx hexo generate
```

检查服务器文件：

```bash
ls -lah /var/www/zyang_blog
```

检查 Nginx 配置：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

如果使用 Cloudflare，进入缓存设置中清理缓存。

### 10.8 `git add .` 提交了不该提交的文件

先取消暂存：

```bash
git restore --staged .
```

添加 `.gitignore`：

```bash
node_modules/
public/
.deploy_git/
.DS_Store
.env
*.log
```

重新暂存：

```bash
git add .
git status
```

确认无误后再提交：

```bash
git commit -m "docs: update article"
```

---

## 十一、常用命令速查

| 场景 | 命令 |
|---|---|
| 初始化仓库 | `git init` |
| 克隆仓库 | `git clone <url>` |
| 查看状态 | `git status` |
| 查看修改 | `git diff` |
| 暂存文件 | `git add <file>` |
| 暂存全部 | `git add .` |
| 提交修改 | `git commit -m "message"` |
| 查看历史 | `git log --oneline` |
| 创建分支 | `git switch -c <branch>` |
| 切换分支 | `git switch <branch>` |
| 合并分支 | `git merge <branch>` |
| 变基分支 | `git rebase main` |
| 拉取代码 | `git pull origin main` |
| 推送代码 | `git push` |
| 添加远程仓库 | `git remote add origin <url>` |
| 查看远程仓库 | `git remote -v` |
| 暂存当前工作 | `git stash push -m "message"` |
| 恢复暂存 | `git stash pop` |
| 取消暂存 | `git restore --staged <file>` |
| 撤销修改 | `git restore <file>` |
| 回退提交 | `git reset --soft HEAD~1` |
| 安全撤销提交 | `git revert <commit>` |
| 查看操作记录 | `git reflog` |

---

## 总结

Git 负责本地版本控制，GitHub 负责远程协作与自动化流程。实际项目中，建议遵循以下原则：

1. 不直接在 `main` 分支开发。
2. 每个功能使用独立分支。
3. 合并前通过 Pull Request 进行审查。
4. 提交信息保持清晰、可追踪。
5. 遇到冲突先确认原因，再手动保留正确内容。
6. Hexo 博客部署建议使用 GitHub Actions + Nginx 静态目录方案。

按照这套流程使用 Git 与 GitHub，可以让个人项目和团队项目都保持清晰、稳定、可回滚。
