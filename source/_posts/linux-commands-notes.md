---
title: 我常用的 Linux 命令整理
date: 2026-04-23 11:20:00

cover: /img/covers/posts/linux-common-commands-tutorial.png

categories:
  - Linux运维

tags:
  - Linux
  - VPS

description: 整理目前在 VPS 与 Linux 环境中使用频率较高的一些常用命令，包括文件管理、进程排查、网络检测与服务管理。
---

> 本文基于个人 VPS 使用过程进行了整理，部分内容参考 Linux 官方手册与社区文档。

# 一、为什么整理这篇文章

最近在折腾 VPS 与 Docker 环境时，经常会重复使用一些 Linux 命令。

虽然大部分命令并不复杂，但长时间不使用时还是容易忘记参数，因此把目前使用频率较高的一部分命令单独整理了下来。

目前主要使用环境：

- Debian 12
- Docker
- Nginx
- Cloudflare
- VPS 远程运维

# 二、文件与目录操作

## 查看当前目录

```bash
pwd
```

用于查看当前所在路径。

---

## 查看目录文件

```bash
ls
```

常用参数：

```bash
ls -la
```

说明：

- `-l`：显示详细信息
- `-a`：显示隐藏文件

---

## 切换目录

```bash
cd /path
```

返回上一级目录：

```bash
cd ..
```

返回当前用户目录：

```bash
cd ~
```

---

## 创建目录

```bash
mkdir blog
```

递归创建：

```bash
mkdir -p /www/wwwroot/blog
```

---

## 复制文件

```bash
cp file.txt /backup/
```

复制目录：

```bash
cp -r source_dir target_dir
```

---

## 移动与重命名

```bash
mv old.txt new.txt
```

移动文件：

```bash
mv file.txt /www/wwwroot/
```

---

## 删除文件

```bash
rm file.txt
```

删除目录：

```bash
rm -rf folder
```

`rm -rf` 建议确认路径后再执行，避免误删系统文件。

# 三、日志与文件查看

## 查看文件内容

```bash
cat file.txt
```

带行号查看：

```bash
cat -n file.txt
```

---

## 查看日志尾部

```bash
tail -f /var/log/nginx/access.log
```

目前主要用于：

- 查看 Nginx 日志
- Docker 容器日志排查
- 实时查看服务状态

退出：

```text
Ctrl + C
```

---

## 分页查看文件

```bash
less file.txt
```

常用操作：

- `/关键词` 搜索
- `q` 退出

# 四、进程与服务管理

## 查看进程

```bash
ps aux
```

查找指定进程：

```bash
ps aux | grep nginx
```

目前最常用于：

- 检查 Nginx
- Docker
- Node.js
- Python 服务

---

## 实时查看系统资源

```bash
top
```

如果需要更直观的界面：

```bash
apt install htop -y
```

然后执行：

```bash
htop
```

---

## systemctl 服务管理

启动服务：

```bash
systemctl start nginx
```

重启服务：

```bash
systemctl restart nginx
```

查看状态：

```bash
systemctl status nginx
```

开机自启：

```bash
systemctl enable nginx
```

目前最常用：

- nginx
- docker
- mysql

---

## 查看服务日志

```bash
journalctl -u nginx
```

实时日志：

```bash
journalctl -u nginx -f
```

# 五、网络与 VPS 排查

## 查看端口占用

```bash
ss -tlnp
```

查找指定端口：

```bash
ss -tlnp | grep 80
```

目前主要用于：

- 检查 Nginx 是否启动
- 检查 Docker 端口冲突
- 查看服务监听状态

---

## 测试网络连接

```bash
ping google.com
```

测试 4 次：

```bash
ping -c 4 google.com
```

---

## 查看服务器 IP

公网 IP：

```bash
curl ifconfig.me
```

内网 IP：

```bash
ip addr
```

---

## 查看磁盘占用

```bash
df -h
```

查看目录大小：

```bash
du -sh /www
```

# 六、SSH 与文件传输

## SSH 连接 VPS

```bash
ssh root@IP
```

指定端口：

```bash
ssh -p 22 root@IP
```

---

## 上传文件

```bash
scp file.txt root@IP:/root/
```

下载文件：

```bash
scp root@IP:/root/file.txt ./
```

---

## SSH 密钥权限

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_rsa
```

如果权限错误，SSH 可能会拒绝连接。

# 七、Docker 与 Nginx 常用命令

## Docker

查看容器：

```bash
docker ps
```

查看全部容器：

```bash
docker ps -a
```

查看日志：

```bash
docker logs 容器ID
```

进入容器：

```bash
docker exec -it 容器ID bash
```

重启容器：

```bash
docker restart 容器ID
```

---

## Nginx

测试配置文件：

```bash
nginx -t
```

重载配置：

```bash
systemctl reload nginx
```

重启 Nginx：

```bash
systemctl restart nginx
```

目前主要用于：

- Hexo 静态部署
- Docker 反向代理
- HTTPS 网站

# 八、我目前最常用的组合命令

## 查看 Nginx 进程

```bash
ps aux | grep nginx
```

---

## 查看端口占用

```bash
ss -tlnp | grep 443
```

---

## 实时查看日志

```bash
tail -f /var/log/nginx/error.log
```

---

## 查看 Docker 容器状态

```bash
docker ps -a
```

---

## 查看系统资源

```bash
htop
```

# 九、一些容易忘记的命令

## 解压 tar.gz

```bash
tar -xzvf file.tar.gz
```

---

## 后台运行程序

```bash
nohup python app.py > app.log 2>&1 &
```

---

## 查看历史命令

```bash
history
```

搜索历史命令：

```bash
history | grep docker
```

---

## 查看系统版本

```bash
cat /etc/os-release
```

---

## 查看内存占用

```bash
free -h
```

---

## 查看系统负载

```bash
uptime
```

# 十、使用建议

目前主要把这些命令用于：

- VPS 初始化
- Docker 环境部署
- Hexo 博客维护
- Nginx 配置
- Linux 日志排查

相比整理大量命令大全，我更倾向于只记录自己实际会长期使用的一部分命令。

这样后续维护与查找会更方便，也更符合自己的使用习惯。
