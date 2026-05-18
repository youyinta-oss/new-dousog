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

## 项目结构

```
workspace/
├── apps/
│   └── web/                  # Next.js 主应用
│       ├── src/
│       │   ├── app/         # App Router 页面
│       │   ├── components/  # React 组件
│       │   │   └── editor/ # 文档编辑器
│       │   └── lib/        # 工具库
│       └── prisma/         # Prisma Schema
├── docker-compose.yml      # Docker 服务编排
└── package.json
```

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

## 核心功能

- 空间管理：创建团队空间，按项目/部门组织文档，支持成员权限控制
- 文档编辑：富文本 + Markdown 双模式，支持代码高亮、图片拖拽上传、@提及
- 实时协作：多人同时编辑文档，光标位置可见，变更实时同步
- AI 助手：一键生成文档摘要、根据关键词推荐相关历史文档、智能纠错
- 标签与搜索：文档打标签，全文检索 + 语义搜索，快速定位内容
- 历史版本：自动保存编辑历史，支持版本对比和回滚
