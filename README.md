# 王加齐 · 个人作品集

React + Vite + GSAP / ScrollTrigger。包含首页循环视频、开场动画、生活照与证件照、17 张工程作品图、MagicBento 风格卡片、高清查看器和磨砂悬浮导航。

## 快速运行

使用 Node.js 22.12+（22.x）。

```sh
npm ci
npm run dev
```

生产构建与预览：

```sh
npm run build
npm run preview
```

部署到网站根目录时使用默认构建；自定义子目录使用 `npm run build -- --base /目录名/`。

## GitHub 上传与上线

请先看 [DEPLOY.md](DEPLOY.md)。解压后的 package.json、src、public、.github 等文件应位于仓库根目录。不要仅将整个 ZIP 作为一个文件提交到仓库。

已附 GitHub Pages 自动部署工作流。在 Settings → Pages 将 Source 设置为 GitHub Actions，之后在 Actions 中运行 Deploy portfolio to GitHub Pages。

GitHub Pages 工作流自动读取实际部署 base_path，图片、视频和脚本都支持仓库子目录。Vercel/Netlify 构建命令为 npm run build，输出目录为 dist。

## 资源与性能

图纸列表提供响应式 WebP 预览，高清弹窗先加载 3200px 图，原始尺寸入口与原图链接保留；视频按屏幕大小选择版本，离开首页或后台时暂停。省流量/减少动态偏好默认使用静态封面，支持手动播放。字体使用系统字体。

源码包不包含依赖目录、构建产物、历史截图和旧原视频备份；运行所需的照片、原图与视频均已包含。详情见 [PERFORMANCE.md](PERFORMANCE.md)。

## 文件入口

- src/main.jsx：页面内容、联系方式与导航。
- src/gallery.json：作品图纸数据。
- src/Gallery.jsx：图纸网格、筛选和查看器。
- src/MagicBento.jsx：图纸鼠标聚光与边缘效果，根据用户提供的 React Bits 代码为画廊用途精简改写。
- src/VideoBackdrop.jsx：首页视频与播放策略。
- src/Motion.jsx、src/motion.css：开场和滚动动画。
- src/style.css：主要样式。
- src/assets.js：部署子路径适配。
- public/media/：网站实际使用的本地素材。

所有作品与照片来自用户提供文件。请按自己的内容展示意愿检查后上传。本次交付不包含仓库创建、推送或正式上线。
