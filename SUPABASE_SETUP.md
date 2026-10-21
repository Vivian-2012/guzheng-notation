# Supabase 后端设置（古筝简谱库 · 独立新项目）

本站用一个**新建的独立 Supabase 项目**（和运费站分开）。
以下步骤需要你在 Supabase 控制台亲自执行（建项目、建账号、建表、建桶、设权限属于后端操作）。

---

## 0. 新建项目（免费）

1. 打开 https://supabase.com/dashboard → **New project**
2. Plan 选 **Free**，Region 选离你近的（如 Central EU / Singapore）
3. 设一个数据库密码（自己记好，前端用不到）
4. 项目建好后，到 **Settings → API**，记下两样东西：
   - **Project URL**：形如 `https://xxxxxxxx.supabase.co`
   - **anon / publishable key**：形如 `eyJ...` 或 `sb_publishable_...`

把这两个值发给我，我填进 `index.html` 的 `SB_URL` / `SB_KEY`。

> 免费项目若连续 7 天无请求会被暂停，偶尔访问即可保持活跃。

---

## 1. 建管理员账号（用于登录上传谱子）

控制台 → **Authentication → Users → Add user**：
- Email：你的邮箱
- Password：自己设（至少 6 位）
- 勾选 Auto Confirm User（免邮件验证）

这个账号用来在网页登录后上传/管理谱子。

---

## 2. 建数据表 `scores`

控制台 → **SQL Editor → New query**，粘贴运行：

```sql
-- 曲库表：存曲名、标签、文件路径清单（文件本体放 Storage）
create table if not exists public.scores (
  id         bigint generated always as identity primary key,
  title      text not null,
  tags       text[] default '{}',
  files      text[] not null default '{}',  -- Storage 对象路径，如 {无羁1.png,无羁2.png}
  kind       text default 'image',          -- 'pdf' 或 'image'
  created_at timestamptz default now()
);

alter table public.scores enable row level security;

-- 所有人可读（访客能看曲库）
create policy "scores public read"
  on public.scores for select
  to anon, authenticated using (true);

-- 仅登录用户可增删改（你登录后才能管理）
create policy "scores admin insert"
  on public.scores for insert
  to authenticated with check (true);
create policy "scores admin update"
  on public.scores for update
  to authenticated using (true) with check (true);
create policy "scores admin delete"
  on public.scores for delete
  to authenticated using (true);
```

---

## 3. 建 Storage 桶 `guzheng-scores`

控制台 → **Storage → New bucket**：
- 名称：`guzheng-scores`
- **Public bucket：勾选**（访客不用登录即可看谱子）

然后 → SQL Editor 运行桶策略（所有人可读，仅登录可写）：

```sql
create policy "guzheng public read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'guzheng-scores');

create policy "guzheng admin upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'guzheng-scores');

create policy "guzheng admin update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'guzheng-scores');

create policy "guzheng admin delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'guzheng-scores');
```

---

## 4. 导入现有 7 首谱子

### 方式 A（推荐）：网页里登录后上传
做完前端后，登录管理员 → 点「＋ 上传谱子」→ 选文件、填曲名/标签 → 自动传 Storage + 写表。

### 方式 B：手动一次性导入
1. Storage → `guzheng-scores` 桶 → 把本地 `scores/` 里所有文件上传上去。
2. SQL Editor 运行：

```sql
insert into public.scores (title, tags, files, kind) values
  ('你笑起来真好看', '{流行,轻快}',        '{你笑起来真好看.pdf}',                     'pdf'),
  ('刀剑如梦',       '{影视,古风}',        '{刀剑如梦.pdf}',                           'pdf'),
  ('女人花',         '{经典,抒情}',        '{女人花.jpg}',                             'image'),
  ('醉清波',         '{古风}',             '{醉清波.jpg}',                             'image'),
  ('无羁',           '{影视,古风,陈情令}', '{无羁1.png,无羁2.png,无羁3.png,无羁4.png}', 'image'),
  ('琵琶语',         '{古风,抒情}',        '{琵琶语1.jpg,琵琶语2.jpg}',                'image'),
  ('又见炊烟',       '{经典,抒情}',        '{又见炊烟1.jpg,又见炊烟2.jpg}',            'image');
```

---

## 文件公开 URL 格式

Public 桶对象直链：
```
https://<你的项目>.supabase.co/storage/v1/object/public/guzheng-scores/<文件名>
```
网页用此 URL 加载图片 / 喂给 pdf.js。
