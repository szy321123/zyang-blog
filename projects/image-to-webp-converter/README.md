# Image to WebP Converter

一个纯前端实现的图片格式转换工具，支持多种常见图片格式批量转换为 WebP 格式。

## ✨ 特性

- 📸 **多格式支持** - 支持 JPEG、PNG、GIF、BMP、TIFF、SVG、HEIC、RAW 格式
- 🚀 **纯前端转换** - 所有转换在浏览器中完成，无需上传服务器，保护隐私
- 📦 **批量转换** - 一次可转换多张图片，支持打包下载
- 🎨 **质量调节** - 支持 1-100% 质量调节，平衡文件大小和图片质量
- 📏 **尺寸调整** - 支持自定义输出尺寸，自动保持宽高比
- 👁️ **预览对比** - 实时查看转换前后对比效果
- 📊 **压缩统计** - 显示压缩率和节省空间
- 🌓 **主题自适应** - 根据系统设置自动切换浅色/深色主题
- 📱 **响应式设计** - 完美适配桌面端和移动端

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:5173
```

### 构建生产版本

```bash
# 构建
npm run build

# 预览
npm run preview
```

### 构建 Hexo 博客版本

```bash
npm run build:hexo
```

## 📖 使用说明

### 基本使用

1. **上传图片** - 拖拽图片到上传区域或点击选择文件
2. **调整设置** - 在设置面板中调节质量和尺寸
3. **自动转换** - 上传后自动开始转换
4. **下载结果** - 单张下载或批量打包下载

### 功能说明

#### 质量调节
- 范围：1-100%
- 默认值：80%
- 建议：日常使用 70-85%，高质量需求使用 90-95%

#### 尺寸调整
- 支持自定义宽度和高度
- 可开启/关闭保持宽高比
- 留空表示使用原始尺寸

#### 批量下载
- 自动打包所有已完成的图片
- 生成 ZIP 格式压缩包
- 文件名为原文件名 + .webp 后缀

## 🔧 技术栈

- **框架**: Vue 3.4 + TypeScript
- **构建工具**: Vite 5
- **样式**: 原生 CSS + CSS Variables
- **压缩库**: JSZip
- **HEIC 支持**: heic2any

## 📁 项目结构

```
image-to-webp-converter/
├── src/
│   ├── components/          # Vue 组件
│   │   ├── FileUploader.vue
│   │   ├── ImageList.vue
│   │   ├── SettingsPanel.vue
│   │   ├── StatisticsPanel.vue
│   │   ├── DownloadPanel.vue
│   │   └── PreviewModal.vue
│   ├── core/                # 核心逻辑
│   │   ├── converter.ts
│   │   └── batchManager.ts
│   ├── utils/               # 工具函数
│   │   ├── image.ts
│   │   └── theme.ts
│   ├── types/               # 类型定义
│   │   └── index.ts
│   ├── styles/              # 全局样式
│   │   └── main.css
│   ├── App.vue              # 主应用组件
│   └── main.ts              # 入口文件
├── public/                  # 静态资源
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 🌐 浏览器支持

| 浏览器 | 版本要求 |
|--------|---------|
| Chrome | 85+ |
| Firefox | 80+ |
| Safari | 14+ |
| Edge | 85+ |

**要求**: 浏览器需支持 WebP 格式和 Canvas API

## 🔗 Hexo 博客集成

### 方法一：作为独立页面

1. 构建 Hexo 版本:
```bash
npm run build:hexo
```

2. 将 `dist` 目录内容复制到 Hexo 的 `source` 目录:
```bash
cp -r dist/* /path/to/hexo/source/image-converter/
```

3. 在博客中创建页面:
```yaml
# source/image-converter/index.md
---
title: 图片格式转换
layout: page
---
```

### 方法二：使用 iframe 嵌入

在 Hexo 文章中直接嵌入:

```html
<iframe 
  src="/image-converter/" 
  width="100%" 
  height="800px"
  frameborder="0"
  style="border-radius: 12px;"
></iframe>
```

详见 [Hexo 集成文档](./docs/hexo-integration.md)

## 🎨 AnZhiYu 主题

本项目使用 AnZhiYu Hexo 主题的样式规范，完美融入博客整体风格。

- [AnZhiYu 主题仓库](https://github.com/anzhi-yu/anzhiyu-theme-hexo)
- 支持自动主题切换（浅色/深色）
- 响应式布局适配

## 📝 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📮 联系方式

如有问题或建议，请提交 Issue。
