## 1. Architecture Design
单页面应用架构，纯前端实现，直接调用外部 API。

## 2. Technology Description
- Frontend: React@18 + TypeScript + tailwindcss@3 + Vite
- Initialization Tool: vite-init
- Backend: None (纯前端应用)
- External API: https://v2.xxapi.cn/api/head

## 3. Route Definitions
| Route | Purpose |
|-------|---------|
| / | 首页，展示随机头像 |

## 4. File Structure
```
/workspace
├── src/
│   ├── components/
│   │   ├── AvatarDisplay.tsx    # 头像展示组件
│   │   ├── HistoryGrid.tsx      # 历史记录网格
│   │   └── RefreshButton.tsx    # 刷新按钮
│   ├── hooks/
│   │   └── useRandomAvatar.ts   # 获取随机头像的 Hook
│   ├── App.tsx                  # 主应用组件
│   ├── main.tsx                 # 应用入口
│   └── index.css                # 全局样式
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 5. Key Components
- `AvatarDisplay`: 负责展示当前头像，包含动画效果
- `HistoryGrid`: 展示历史头像记录
- `RefreshButton`: 提供刷新功能和加载状态
- `useRandomAvatar`: 管理头像状态和 API 调用逻辑
