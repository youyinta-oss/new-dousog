# GitHub Store - GitHub 商店

一个精美的 GitHub 风格商店 Web 应用，展示和销售开发工具、插件和应用。

## ✨ 功能特性

- 🎨 GitHub 深色主题设计
- 📦 产品浏览和搜索
- 🗂️ 分类筛选（工具、插件、应用、主题）
- 📄 详细产品页面
- 🛒 购物车功能
- 💳 结算流程
- 📱 响应式设计

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173 查看应用。

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 🛠️ 技术栈

- **React 18** - 前端框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Tailwind CSS** - 样式框架
- **React Router** - 路由管理
- **Zustand** - 状态管理
- **Lucide React** - 图标库

## 📁 项目结构

```
/workspace
├── src/
│   ├── components/        # 组件
│   │   ├── Header.tsx
│   │   ├── ProductCard.tsx
│   │   └── CategoryFilter.tsx
│   ├── pages/            # 页面
│   │   ├── Home.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Category.tsx
│   │   └── Cart.tsx
│   ├── store/            # 状态管理
│   │   └── useCartStore.ts
│   ├── data/             # 数据
│   │   └── mockData.ts
│   ├── types/            # 类型定义
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
├── public/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 📝 页面说明

### 首页 (/)
- 展示所有产品
- 分类导航
- 产品卡片网格

### 产品详情页 (/product/:id)
- 产品大图展示
- 产品详细信息
- 产品截图
- 加入购物车按钮

### 分类页 (/category/:category)
- 按分类筛选产品
- 显示产品数量

### 购物车 (/cart)
- 购物车商品列表
- 数量调整
- 删除商品
- 总价计算

## 🎯 核心功能

### 购物车状态管理
使用 Zustand 进行全局状态管理：
- 添加商品
- 删除商品
- 调整数量
- 计算总价

### 分类系统
支持以下分类：
- 工具 (Tools)
- 插件 (Plugins)
- 应用 (Apps)
- 主题 (Themes)

## 📄 文档

- [产品需求文档 (PRD)](.trae/documents/prd.md)
- [技术架构文档](.trae/documents/arch.md)

## 📦 示例产品

- GitHub Actions Pro
- Code Review Assistant
- Git History Visualizer
- Issue Tracker Pro
- Dark Theme Pack
- Pull Request Enhancer

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
