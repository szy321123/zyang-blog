---
title: 更换博客字体提升美观度
date: 2026-05-08 15:30:00

cover: /img/covers/posts/cover.webp

categories:
  - 安知鱼主题

tags:
  - 安知鱼
  - Hexo

description: 记录安知鱼主题更换博客字体的过程，包括本地字体、自托管字体与代码字体的配置方式。
---

> 本文基于 Hexo 与安知鱼主题官方文档，并结合个人博客配置过程进行了整理。

# 一、为什么开始更换博客字体

最近在调整博客 UI 时，顺手把字体也重新换了一遍。

默认字体其实没有问题，但放到安知鱼这种偏卡片化、毛玻璃风格的主题里，总感觉整体不够统一。

目前个人更偏向：

- 简洁一点的无衬线字体
- 中文阅读更舒服的字体
- 本地托管方案

目前博客环境：

- Hexo
- 安知鱼主题
- Cloudflare
- Nginx

# 二、安知鱼主题字体的配置方式

目前我主要使用两种方式：

- 本地字体文件
- CDN 字体

相比直接使用 Google Fonts：

- 国内访问更稳定
- 字体加载更快
- 不容易出现字体丢失

目前更推荐：

```text
本地字体 + woff2
```

# 三、安知鱼主题字体配置位置

目前主要通过：

```text
source/css/custom.css
```

覆盖主题默认字体。

如果目录不存在，可以手动创建。

# 四、最简单的字体替换方式

创建：

```text
source/css/custom.css
```

然后添加：

```css
body {
  font-family: "MiSans", "PingFang SC", sans-serif;
}
```

# 五、使用本地字体文件

目前个人更推荐本地托管。

先创建：

```text
source/fonts
```

然后放入字体文件：

```text
MiSans-Regular.woff2
JetBrainsMono-Regular.woff2
```

目前更推荐：

- woff2
- woff

不太建议直接使用体积较大的 ttf。

# 六、通过 @font-face 引入字体

打开：

```text
source/css/custom.css
```

添加：

```css
@font-face {
  font-family: "MiSans";
  src: url("/fonts/MiSans-Regular.woff2") format("woff2");
  font-display: swap;
}

@font-face {
  font-family: "JetBrains Mono";
  src: url("/fonts/JetBrainsMono-Regular.woff2") format("woff2");
  font-display: swap;
}

body {
  font-family: "MiSans", "PingFang SC", sans-serif;
}

code,
pre {
  font-family: "JetBrains Mono", monospace;
}
```

# 七、引入 custom.css

打开：

```text
themes/anzhiyu/source/css/index.styl
```

在最后添加：

```styl
@import "../../../../source/css/custom.css"
```

# 八、一些目前还在用的字体网站

## MiSans

小米官方开源字体：

```text
https://hyperos.mi.com/font
```

---

## Google Fonts

```text
https://fonts.google.com/
```

目前主要用来找代码字体。

---

## 猫啃网字体

```text
https://www.maoken.com/
```

国内比较常用的字体整理站。

# 九、一个我目前真实在用的字体方案

目前博客里主要使用：

```text
MiSans + JetBrains Mono
```

比较适合：

- 安知鱼主题
- 深色模式
- 卡片风格博客

# 十、修改后如何生效

执行：

```bash
hexo clean
hexo generate
hexo server
```

本地访问：

```text
http://localhost:4000
```

# 十一、我实际遇到的一些问题

## 字体没有生效

目前最常见的原因：

- CSS 路径错误
- custom.css 未正确引入
- 浏览器缓存

建议先强制刷新浏览器：

```text
Ctrl + F5
```

---

## 字体文件 404

检查：

```text
source/fonts
```

路径是否正确。

---

## Google Fonts 无法加载

目前国内环境下比较常见。

相比直接使用 Google Fonts：

- 更建议本地托管
- 或者使用 CDN 镜像

# 十二、目前我的字体配置思路

目前个人主要使用：

```text
MiSans + JetBrains Mono
```

正文使用中文无衬线字体，代码块单独使用等宽字体。

相比默认字体：

- 阅读体验会更统一
- 深色模式观感更舒服
- 更适合安知鱼主题整体风格
