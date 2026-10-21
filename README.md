# 🎍 古筝简谱库

一个纯静态网页，用来搜索和查看古筝简谱。谱子文件（PDF / jpg / png）和曲库清单都存在
**Supabase**（独立的免费项目），网页从 Supabase 读取，支持搜索、翻页查看、登录后在线上传。
架构参考 `微信小灵群-site`（同样用 Supabase 做后端）。

## 功能

- 🔍 按曲名 / 标签搜索
- 📖 点开后翻页查看（上一页 / 下一页，键盘 ← →）
- 📄 PDF 谱子用 pdf.js 渲染，多页自动翻页
- 🖼 图片谱子（多张即多页）
- 🔐 管理员登录后可**上传 / 删除**谱子（访客只读）
- 📱 手机 / 电脑自适应

## 架构

| 部分 | 存放位置 |
|------|----------|
| 谱子源文件（pdf/jpg/png） | Supabase Storage 桶 `guzheng-scores`（public 读） |
| 曲库清单（曲名/标签/文件列表） | Supabase 数据表 `public.scores` |
| 登录 / 权限 | Supabase Auth |
| 前端页面 | `index.html`（本仓库，可部署到 GitHub Pages） |
| pdf.js | `vendor/`（本地） |

谱子文件**不再放在 git 仓库里**，全部在 Supabase Storage。

## 首次设置

1. 按 `SUPABASE_SETUP.md` 在 Supabase 新建项目、建表、建桶、设权限、建管理员账号。
2. 把项目的 **Project URL** 和 **anon key** 填进 `index.html` 顶部：
   ```js
   const SB_URL='https://xxxx.supabase.co';
   const SB_KEY='eyJ...';
   ```
3. 导入现有谱子（二选一）：
   - 登录网页 →「＋ 上传谱子」逐首上传；或
   - 按 `SUPABASE_SETUP.md` 方式 B 手动批量导入。

## 添加新谱子

登录管理员 →「＋ 上传谱子」→ 填曲名、标签 → 选文件：
- PDF：单个文件（多页由 pdf.js 自动翻页）
- 图片：可多选，每张图是一页，按选择顺序排页

## 本地预览

```bash
cd guzheng-notation--site
python3 -m http.server 8000
# 浏览器打开 http://localhost:8000（需先填好 SB_URL / SB_KEY）
```

## 部署（GitHub Pages）

推到 GitHub 后，仓库 Settings → Pages 选 `main` 分支根目录即可。
仓库：https://github.com/Vivian-2012/guzheng-notation

> `scores/` 目录仅临时保留本地原始谱子，方便首次导入 Supabase；导入后可从 git 移除。
