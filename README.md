# TeamMind - 团队知识管理与协作平台

一个面向小型团队的知识沉淀工具，支持 Markdown 文档编辑、实时协作、AI 智能摘要和标签化分类，解决「团队知识散落在聊天记录和本地文件」的痛点。

## 技术栈

- 前端: React 18 + TypeScript + Tailwind CSS
- 全栈框架: Next.js 14 (App Router)
- 编辑器: TipTap (基于 ProseMirror)
- 实时通信: WebSocket + Yjs (CRDT 协同)
- 数据库: PostgreSQL + Prisma ORM
- 认证: NextAuth.js
- AI 集成: OpenAI API
- 部署: Docker
- Monorepo: Turborepo

## 项目结构

```
workspace/
├── apps/
│   └── web/                      # Next.js 主应用
│       ├── src/
│       │   ├── app/             # App Router 页面
│       │   │   ├── (auth)/      # 认证相关页面
│       │   │   ├── (dashboard)/ # 仪表板相关页面
│       │   │   └── api/         # API 路由
│       │   ├── components/      # React 组件
│       │   │   ├── editor/      # 文档编辑器
│       │   │   └── ui/          # UI 组件库
│       │   └── lib/             # 工具库
│       ├── prisma/              # Prisma Schema
│       └── package.json
├── docker-compose.yml           # Docker 服务编排
├── turbo.json                  # Turborepo 配置
└── package.json
```

## 已完成功能

✅ **项目初始化**
- Next.js 14 + TypeScript + Tailwind CSS 项目结构
- Turborepo 工作区配置

✅ **数据库设计**
- 用户、空间、文档、标签、评论等数据模型
- Prisma ORM 配置
- Docker Compose 数据库服务

✅ **认证模块**
- NextAuth.js 集成
- 登录页面
- 支持邮箱密码和 Google OAuth

✅ **文档编辑器**
- TipTap 富文本编辑器
- 丰富的工具栏（加粗、斜体、标题、列表等）
- 协作编辑器组件（支持 Yjs）
- 文档编辑页面

✅ **仪表板**
- 响应式侧边栏导航
- 首页仪表板（统计数据、最近文档）
- 空间管理页面
- 文档编辑页面
- 搜索页面

✅ **API 路由**
- 文档 CRUD 操作
- 空间管理
- 标签管理
- 历史版本管理
- AI 摘要生成

✅ **核心功能**
- 标签管理：文档打标签，颜色分类
- 历史版本：版本历史查看，恢复旧版本
- AI 助手：文档摘要生成（集成 OpenAI API）
- 实时协作：基于 Yjs 的协作编辑架构
- 搜索功能：全文检索，标签和空间筛选

## 快速开始

### 1. 启动数据库

```bash
docker-compose up -d
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `.env.example` 到 `.env` 并填写必要的配置：

```bash
cp .env.example .env
```

### 4. 运行数据库迁移

```bash
cd apps/web
npx prisma generate
npx prisma db push
```

### 5. 启动开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动。

## 核心功能路线图

- ✅ 空间管理：创建团队空间，按项目/部门组织文档，支持成员权限控制
- ✅ 文档编辑：富文本编辑器，支持多种格式化功能
- ✅ 实时协作：多人同时编辑文档，光标位置可见，变更实时同步 (Yjs)
- ✅ AI 助手：一键生成文档摘要、根据关键词推荐相关历史文档、智能纠错
- ✅ 标签与搜索：文档打标签，全文检索 + 语义搜索，快速定位内容
- ✅ 历史版本：自动保存编辑历史，支持版本对比和回滚

## 开发指南

### 页面路由说明

- `/` - 首页（欢迎页面）
- `/login` - 登录页面
- `/dashboard` - 仪表板
- `/spaces/[id]` - 空间详情页
- `/documents/[id]` - 文档编辑页
- `/search` - 搜索页面

### 组件库

项目使用 Tailwind CSS 和自定义的 UI 组件，主要组件包括：
- `Button` - 按钮组件
- `Input` - 输入框组件
- `Sidebar` - 侧边栏导航
- `TipTapEditor` - 富文本编辑器
- `CollaborativeEditor` - 协作编辑器

### API 路由

- `POST /api/auth/[...nextauth]` - NextAuth 认证
- `GET/POST /api/documents` - 获取/创建文档
- `GET/PUT/DELETE /api/documents/[id]` - 文档 CRUD
- `POST /api/documents/[id]/versions` - 创建文档版本
- `GET /api/documents/[id]/versions` - 获取文档版本历史
- `GET/POST /api/spaces` - 获取/创建空间
- `GET/POST /api/tags` - 获取/创建标签
- `POST /api/ai/summarize` - AI 文档摘要

### 数据库模型

主要数据表：
- `User` - 用户
- `Space` - 空间
- `SpaceMember` - 空间成员（权限管理）
- `Document` - 文档
- `Tag` - 标签
- `DocumentTag` - 文档标签关联
- `DocumentVersion` - 文档版本
- `Comment` - 评论

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## License

MIT
