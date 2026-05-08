# zyangblog

基于 `Hexo` + `AnZhiYu` 主题的个人博客项目。

## 环境要求

- Node.js 18+
- npm 9+

## 安装依赖

```bash
npm install
```

## 本地预览

```bash
npx hexo clean
npx hexo generate
npx hexo server
```

默认访问地址：

- [http://localhost:4000](http://localhost:4000)

## 常用命令

```bash
# 新建文章
npx hexo new post "文章标题"

# 清理缓存与生成文件
npx hexo clean

# 生成静态文件
npx hexo generate

# 本地启动
npx hexo server
```

## 目录说明

```text
source/          # 文章、页面、静态资源（css/js/img）
themes/anzhiyu/  # AnZhiYu 主题
scaffolds/       # 文章模板
_config.yml      # Hexo 主配置
_config.anzhiyu.yml  # 主题配置
```

## 部署建议

建议使用 GitHub Actions 或 Hexo 部署命令进行发布，发布前先执行：

```bash
npx hexo clean
npx hexo generate
```

## 维护说明

- 主题外观优先通过 `_config.anzhiyu.yml` 和 `source/css/custom.css` 调整。
- 自定义脚本建议放在 `source/js/` 下，并通过主题 `inject` 引入。
- 修改后先本地验证，再推送远程仓库。
