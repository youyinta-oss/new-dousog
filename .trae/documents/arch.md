## 1. 架构设计

单页面应用架构，纯前端实现，直接调用外部 API。

## 2. 技术栈说明

- 前端：React@18 + TypeScript + tailwindcss@3 + Vite
- 初始化工具：vite-init
- 后端：无（纯前端应用）
- 外部 API：https://v2.xxapi.cn/api/head

## 3. 路由定义

| 路由 | 用途 |
|-----|------|
| / | 首页，展示随机头像 |

## 4. 文件结构

```
/workspace
├── src/
│   ├── components/
│   │   ├── AvatarDisplay.tsx    # 头像展示组件
│   │   ├── HistoryGrid.tsx      # 历史记录网格
│   │   ├── RefreshButton.tsx    # 刷新按钮
│   │   └── ActionButtons.tsx    # 操作按钮（复制、下载）
│   ├── hooks/
│   │   ├── useRandomAvatar.ts   # 获取随机头像的 Hook
│   │   └── useKeyboardShortcuts.ts  # 键盘快捷键 Hook
│   ├── App.tsx                  # 主应用组件
│   ├── main.tsx                 # 应用入口
│   └── index.css                # 全局样式
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 5. 核心组件

- `AvatarDisplay`：负责展示当前头像
- `HistoryGrid`：展示历史头像记录
- `RefreshButton`：提供刷新功能和加载状态
- `ActionButtons`：提供复制链接和下载功能
- `useRandomAvatar`：管理头像状态和 API 调用逻辑，支持本地存储
