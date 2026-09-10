# 查看主页半成品

在终端运行：
```sh
cd /Users/jiajun/Documents/code/acad-homepage.github.io
python3 _preview/serve.py
```
打开 http://127.0.0.1:4001/ 。保持终端运行；按 Control+C 停止。

修改 `_pages/about.md` 正文、`assets/css/personal.css` 样式或 `_data/navigation.yml` 导航后，刷新页面即可看到变化。

## 预览范围

本机 Jekyll 环境尚未安装成功。这个轻量预览使用 AcadHomepage 原演示页的渲染外壳与编译 CSS，并从当前源码读取正文、导航和姓名/身份。它不是完整的 Jekyll 构建，不编译 SCSS、不处理任意 Liquid、不验证正式发布。头像与社交链接若后续更改，也需同步 `_preview/shell.html`。

正文采用 HTML，Jekyll 可在 `_pages/about.md` 中直接渲染；正式页面仍使用原版 `_layouts/default.html` 和侧栏。`_preview/`、说明文档已从 Jekyll 输出排除，生成的 `_site/` 不纳入 Git。

原模板来源：https://github.com/RayeRen/acad-homepage.github.io
预览外壳与 CSS 来源：https://rayeren.github.io/acad-homepage.github.io/

正式环境可用后运行 `bundle install` 和 `bundle exec jekyll serve`。GitHub Pages 发布状态请在仓库 Settings → Pages 中查看。
