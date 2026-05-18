# TeamMind 团队知识管理与协作平台 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个面向小型团队的知识沉淀工具，支持 Markdown 文档编辑、实时协作、AI 智能摘要和标签化分类。

**Architecture:** 使用 Next.js 14 全栈框架，前端采用 React 18 + TypeScript + Tailwind CSS，后端使用 Next.js API Routes，数据库使用 PostgreSQL + Prisma ORM，实时协作采用 Yjs + Socket.IO，AI 功能集成 OpenAI API。

**Tech Stack:**
- 前端: React 18 + TypeScript + Tailwind CSS
- 全栈框架: Next.js 14 (App Router)
- 编辑器: TipTap (基于 ProseMirror)
- 实时通信: Socket.IO + Yjs (CRDT 协同)
- 数据库: PostgreSQL + Prisma ORM
- 认证: NextAuth.js
- AI集成: OpenAI API
- 部署: Docker

---

## 文件结构

```
/workspace
├── apps/
│   └── web/                          # Next.js 主应用
│       ├── src/
│       │   ├── app/                  # App Router 页面
│       │   │   ├── (auth)/           # 认证相关页面
│       │   │   ├── (dashboard)/      # 仪表板
│       │   │   ├── api/              # API 路由
│       │   │   └── layout.tsx
│       │   ├── components/           # React 组件
│       │   │   ├── editor/           # 文档编辑器组件
│       │   │   ├── ui/               # UI 组件库
│       │   │   └── ...
│       │   ├── lib/                  # 工具库
│       │   │   ├── prisma.ts         # Prisma 客户端
│       │   │   ├── socket.ts         # Socket.IO 客户端
│       │   │   └── yjs.ts            # Yjs 配置
│       │   └── types/                # TypeScript 类型定义
│       ├── prisma/                   # Prisma Schema
│       │   └── schema.prisma
│       └── package.json
├── packages/
│   └── shared/                       # 共享代码包
│       └── types/
├── docker-compose.yml
├── .env.example
└── package.json
```

---

## 任务列表

### Task 1: 初始化 Next.js + TypeScript + Tailwind CSS 项目结构

**Files:**
- Create: `/workspace/package.json`
- Create: `/workspace/apps/web/package.json`
- Create: `/workspace/apps/web/tsconfig.json`
- Create: `/workspace/apps/web/tailwind.config.ts`
- Create: `/workspace/apps/web/postcss.config.js`
- Create: `/workspace/apps/web/next.config.js`
- Create: `/workspace/apps/web/src/app/layout.tsx`
- Create: `/workspace/apps/web/src/app/page.tsx`

- [ ] **Step 1: 创建根目录 package.json**

```json
{
  "name": "teammind",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.4.0"
  },
  "engines": {
    "node": ">=18"
  }
}
```

- [ ] **Step 2: 创建 apps/web 目录的 package.json**

```json
{
  "name": "@teammind/web",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@prisma/client": "^5.12.0",
    "@tiptap/core": "^2.2.0",
    "@tiptap/extension-placeholder": "^2.2.0",
    "@tiptap/pm": "^2.2.0",
    "@tiptap/react": "^2.2.0",
    "@tiptap/starter-kit": "^2.2.0",
    "lucide-react": "^0.360.0",
    "next": "14.1.4",
    "next-auth": "^4.24.7",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "socket.io-client": "^4.7.5",
    "y-protocols": "^1.0.6",
    "y-websocket": "^2.0.3",
    "yjs": "^13.6.14",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.4.19",
    "eslint": "^8",
    "eslint-config-next": "14.1.4",
    "postcss": "^8.4.38",
    "prisma": "^5.12.0",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
```

- [ ] **Step 3: 创建 TypeScript 配置文件**

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: 创建 Tailwind CSS 配置**

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 5: 创建 PostCSS 配置**

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 6: 创建 Next.js 配置**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

module.exports = nextConfig;
```

- [ ] **Step 7: 创建根布局文件**

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TeamMind - 团队知识管理与协作平台",
  description: "面向小型团队的知识沉淀工具",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

- [ ] **Step 8: 创建全局样式文件**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-50 text-gray-900;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

- [ ] **Step 9: 创建首页**

```tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            TeamMind
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            团队知识管理与协作平台，让知识沉淀更简单
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              开始使用
            </Link>
            <Link
              href="/about"
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              了解更多
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
```

---

### Task 2: 创建数据库模型和 Prisma 配置

**Files:**
- Create: `/workspace/apps/web/prisma/schema.prisma`
- Create: `/workspace/apps/web/src/lib/prisma.ts`
- Create: `/workspace/.env.example`
- Create: `/workspace/docker-compose.yml`

- [ ] **Step 1: 创建 Prisma Schema**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  spaces        SpaceMember[]
  documents     Document[]
  comments      Comment[]
  versions      DocumentVersion[]

  @@map("users")
}

model Space {
  id          String         @id @default(cuid())
  name        String
  description String?
  icon        String?
  color       String?
  isPublic    Boolean        @default(false)
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
  members     SpaceMember[]
  documents   Document[]
  tags        Tag[]

  @@map("spaces")
}

model SpaceMember {
  id        String   @id @default(cuid())
  userId    String
  spaceId   String
  role      Role     @default(EDITOR)
  joinedAt  DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  space     Space    @relation(fields: [spaceId], references: [id], onDelete: Cascade)

  @@unique([userId, spaceId])
  @@map("space_members")
}

enum Role {
  OWNER
  EDITOR
  VIEWER
}

model Document {
  id          String            @id @default(cuid())
  title       String
  content     String            @db.Text
  summary     String?           @db.Text
  spaceId     String
  authorId    String
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt
  space       Space             @relation(fields: [spaceId], references: [id], onDelete: Cascade)
  author      User              @relation(fields: [authorId], references: [id], onDelete: Cascade)
  tags        DocumentTag[]
  comments    Comment[]
  versions    DocumentVersion[]

  @@map("documents")
}

model Tag {
  id         String        @id @default(cuid())
  name       String
  color      String?
  spaceId    String
  createdAt  DateTime      @default(now())
  space      Space         @relation(fields: [spaceId], references: [id], onDelete: Cascade)
  documents  DocumentTag[]

  @@unique([name, spaceId])
  @@map("tags")
}

model DocumentTag {
  documentId String
  tagId      String
  document   Document @relation(fields: [documentId], references: [id], onDelete: Cascade)
  tag        Tag      @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([documentId, tagId])
  @@map("document_tags")
}

model Comment {
  id         String   @id @default(cuid())
  content    String   @db.Text
  documentId String
  authorId   String
  createdAt  DateTime @default(now())
  document   Document @relation(fields: [documentId], references: [id], onDelete: Cascade)
  author     User     @relation(fields: [authorId], references: [id], onDelete: Cascade)

  @@map("comments")
}

model DocumentVersion {
  id         String   @id @default(cuid())
  title      String
  content    String   @db.Text
  documentId String
  authorId   String
  createdAt  DateTime @default(now())
  document   Document @relation(fields: [documentId], references: [id], onDelete: Cascade)
  author     User     @relation(fields: [authorId], references: [id], onDelete: Cascade)

  @@map("document_versions")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}
```

- [ ] **Step 2: 创建 Prisma 客户端文件**

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

- [ ] **Step 3: 创建环境变量示例文件**

```env
# Database
DATABASE_URL="postgresql://teammind:teammind@localhost:5432/teammind?schema=public"

# Next Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"

# OpenAI
OPENAI_API_KEY="your-openai-api-key-here"
```

- [ ] **Step 4: 创建 Docker Compose 文件**

```yaml
version: "3.8"

services:
  db:
    image: postgres:15-alpine
    container_name: teammind-db
    environment:
      POSTGRES_USER: teammind
      POSTGRES_PASSWORD: teammind
      POSTGRES_DB: teammind
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

### Task 3: 实现认证和用户管理模块

**Files:**
- Create: `/workspace/apps/web/src/app/api/auth/[...nextauth]/route.ts`
- Create: `/workspace/apps/web/src/lib/auth.ts`
- Create: `/workspace/apps/web/src/app/(auth)/login/page.tsx`
- Create: `/workspace/apps/web/src/app/(auth)/register/page.tsx`

- [ ] **Step 1: 创建 NextAuth 配置**

```typescript
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          return null;
        }

        const passwordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (passwordValid) {
          return user;
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

- [ ] **Step 2: 创建登录页面**

```tsx
"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    router.push("/dashboard");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("登录失败，请检查邮箱和密码");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900">
            登录 TeamMind
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-600 text-center">{error}</div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                邮箱
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="邮箱地址"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                密码
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              登录
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

---

### Task 4: 实现 TipTap 文档编辑器

**Files:**
- Create: `/workspace/apps/web/src/components/editor/TipTapEditor.tsx`
- Create: `/workspace/apps/web/src/components/editor/EditorToolbar.tsx`

- [ ] **Step 1: 创建 TipTap 编辑器组件**

```tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorToolbar } from "./EditorToolbar";

interface TipTapEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
}

export function TipTapEditor({
  content = "",
  onChange,
  placeholder = "开始写作...",
}: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <EditorToolbar editor={editor} />
      <div className="p-6 min-h-[400px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 创建编辑器工具栏组件**

```tsx
import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Undo,
  Redo,
} from "lucide-react";

interface EditorToolbarProps {
  editor: Editor;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-200 disabled:opacity-30 ${
          editor.isActive("bold") ? "bg-gray-200" : ""
        }`}
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-200 disabled:opacity-30 ${
          editor.isActive("italic") ? "bg-gray-200" : ""
        }`}
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`p-2 rounded hover:bg-gray-200 disabled:opacity-30 ${
          editor.isActive("strike") ? "bg-gray-200" : ""
        }`}
      >
        <Strikethrough className="w-4 h-4" />
      </button>
      <div className="w-px bg-gray-300 mx-1" />
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        disabled={!editor.can().chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-gray-200 disabled:opacity-30 ${
          editor.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""
        }`}
      >
        <Heading1 className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        disabled={!editor.can().chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-gray-200 disabled:opacity-30 ${
          editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""
        }`}
      >
        <Heading2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        disabled={!editor.can().chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded hover:bg-gray-200 disabled:opacity-30 ${
          editor.isActive("heading", { level: 3 }) ? "bg-gray-200" : ""
        }`}
      >
        <Heading3 className="w-4 h-4" />
      </button>
      <div className="w-px bg-gray-300 mx-1" />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        disabled={!editor.can().chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-200 disabled:opacity-30 ${
          editor.isActive("bulletList") ? "bg-gray-200" : ""
        }`}
      >
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        disabled={!editor.can().chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-200 disabled:opacity-30 ${
          editor.isActive("orderedList") ? "bg-gray-200" : ""
        }`}
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <div className="w-px bg-gray-300 mx-1" />
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        disabled={!editor.can().chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-gray-200 disabled:opacity-30 ${
          editor.isActive("blockquote") ? "bg-gray-200" : ""
        }`}
      >
        <Quote className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={`p-2 rounded hover:bg-gray-200 disabled:opacity-30 ${
          editor.isActive("code") ? "bg-gray-200" : ""
        }`}
      >
        <Code className="w-4 h-4" />
      </button>
      <div className="w-px bg-gray-300 mx-1" />
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="p-2 rounded hover:bg-gray-200 disabled:opacity-30"
      >
        <Undo className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="p-2 rounded hover:bg-gray-200 disabled:opacity-30"
      >
        <Redo className="w-4 h-4" />
      </button>
    </div>
  );
}
```

---

## 后续任务概述

由于计划文档篇幅限制，以下为后续关键任务概述，详细步骤将在执行过程中展开：

- **Task 5:** 实现空间管理和权限控制
- **Task 6:** 实现实时协作功能 (Yjs + Socket.IO)
- **Task 7:** 实现标签和搜索功能
- **Task 8:** 实现历史版本管理
- **Task 9:** 集成 AI 助手功能
