# GitHub 上传与部署

## 包内内容

这是源码包，包含 React、Vite、GSAP 源代码、package-lock.json、全部在用的图纸原图/分级预览图、照片、优化后的视频，以及 GitHub Pages 自动部署工作流。

不包含 node_modules、dist、缓存、历史截图和 originals 原始视频备份。运行需要的素材都已保留。无需 Git LFS。

## 本地运行

安装 Node.js 22.12 或更新的 22.x 版本，解压后，在包含 package.json 的目录打开终端：

```powershell
npm ci
npm run dev
```

本地构建和生产预览：

```powershell
npm run build
npm run preview
```

打开命令输出的 http 地址。不要双击 index.html，也不要把 vite preview 当作生产服务器。

## 上传 GitHub

1. 新建一个空仓库。使用 GitHub Free 发布 Pages 时，采用公开仓库。
2. 解压 ZIP，把内部的所有文件和目录放到仓库根目录，包含 `.github`、`.gitignore` 和 `.nvmrc`。仓库根目录应能直接看到 package.json、src/、public/，不要再额外套一层目录。
3. 推荐使用 GitHub Desktop 把这个目录作为本地仓库，然后提交并推送至 main。也可以使用 Git 命令：

```powershell
git init
git add .
git commit -m "Add portfolio website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

将示例地址替换为你自己新建的仓库地址。已有仓库请在自己的正常 Git 流程中添加文件，勿重复初始化或覆盖历史。不要仅把 ZIP 文件上传到仓库：自动部署需要解压后的源码。

## GitHub Pages 自动上线

1. 在仓库 Settings → Pages → Build and deployment 中，将 Source 设为 **GitHub Actions**。
2. 打开 Actions，选择 **Deploy portfolio to GitHub Pages**，点 Run workflow。以后推送到 main 或 master 会自动重新部署。
3. 等待成功，在部署记录中打开网站地址。

工作流从 GitHub Pages 读取实际 base_path，构建时应用到脚本、图片、视频和 CSS 素材地址，因此可以部署到 `用户名.github.io/仓库名/`，也支持 Pages 配置的根路径/自定义域名。无需手工修改 gallery.json。

首次推送时如果还未设置 Pages，首次工作流可能失败；完成第 1 步后重新运行即可。仓库若有部署分支保护限制，需要在 Settings → Environments → github-pages 中允许实际部署分支。

## Vercel / Netlify / 普通静态托管

- 安装命令：`npm ci`
- 构建命令：`npm run build`
- 输出目录：`dist`
- 普通域名根目录部署使用默认 `/` 路径。
- 若部署到自定义子目录，使用 `npm run build -- --base /子目录名/`。
- 本站使用页面内锚点导航，不需要后端服务、数据库、API 密钥或环境变量。

## 修改入口

- 页面内容、联系方式：src/main.jsx
- 图纸清单：src/gallery.json
- 图纸显示与原图查看：src/Gallery.jsx
- 首页视频播放：src/VideoBackdrop.jsx
- 开场与滚动动画：src/Motion.jsx
- 样式：src/style.css、src/motion.css
- 媒体文件：public/media/

## 上线前的内容确认

网站包含你提供的生活照、证件照、邮箱、电话号码和图纸。公开仓库和公开网站会公开这些已有内容。请在上传前按自己的展示意愿检查。

## 官方参考

- [Vite 静态部署](https://vite.dev/guide/static-deploy.html)
- [GitHub Pages 自定义工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

当前只是部署准备包，本次没有创建仓库、推送或发布网站。
