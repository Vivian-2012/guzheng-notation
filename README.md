# 🎍 古筝简谱库

一个纯静态网页，用来搜索和查看古筝简谱。支持 PDF 和图片（jpg/png）格式的谱子，带翻页浏览功能。

## 功能

- 🔍 按曲名/标签搜索
- 📖 点开后翻页查看（上一页 / 下一页，支持键盘 ← →）
- 📄 PDF 谱子用 pdf.js 渲染，多页自动翻页
- 🖼 图片谱子（多张即多页）
- 📱 手机 / 电脑自适应，纯静态无需后端

## 目录结构

```
index.html          主页（搜索 + 阅读器）
songs.json          曲库数据：曲名、标签、文件列表
scores/             谱子文件（pdf / jpg / png）
vendor/pdf.min.js   pdf.js（本地，渲染 PDF）
vendor/pdf.worker.min.js
```

## 添加新谱子

1. 把谱子文件放进 `scores/` 目录。
2. 在 `songs.json` 的 `songs` 数组里加一条：

```json
{
  "title": "曲名",
  "tags": ["古风", "抒情"],
  "files": ["scores/曲名.jpg"]
}
```

- 单文件 PDF：`"files": ["scores/曲名.pdf"]`（多页由 pdf.js 自动翻页）
- 多张图片：按顺序列出，每张图是一页
  ```json
  "files": ["scores/曲名1.png", "scores/曲名2.png"]
  ```

3. 刷新网页即可。

## 本地预览

因为网页用 `fetch` 读取 `songs.json`，需要通过 http 打开（不能直接双击）：

```bash
cd guzheng-notation--site
python3 -m http.server 8000
# 浏览器打开 http://localhost:8000
```

## 部署（GitHub Pages）

推到 GitHub 后，在仓库 Settings → Pages 选择 `main` 分支根目录即可访问。

仓库：https://github.com/Vivian-2012/guzheng-notation
