# React + TypeScript + Vite

这个模板提供了在 Vite 中使用 React 的最小配置，包含热更新（HMR）和一些 ESLint 规则。

目前有两个官方插件可用：

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) 使用 [Babel](https://babeljs.io/) 实现快速刷新
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) 使用 [SWC](https://swc.rs/) 实现快速刷新

## 扩展 ESLint 配置

如果你正在开发生产环境应用，我们建议更新配置以启用类型感知的 lint 规则：

```js
export default tseslint.config({
  extends: [
    // 删除 ...tseslint.configs.recommended 并替换为这个
    ...tseslint.configs.recommendedTypeChecked,
    // 或者，使用这个来获得更严格的规则
    ...tseslint.configs.strictTypeChecked,
    // 可选，添加这个来获得样式相关规则
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // 其他选项...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

你也可以安装 [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) 和 [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) 来获得 React 特定的 lint 规则：

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  extends: [
    // 其他配置...
    // 启用 React 的 lint 规则
    reactX.configs['recommended-typescript'],
    // 启用 React DOM 的 lint 规则
    reactDom.configs.recommended,
  ],
  languageOptions: {
    // 其他选项...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```
