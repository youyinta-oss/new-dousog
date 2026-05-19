import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    title: 'GitHub Actions Pro',
    author: 'GitHub',
    description: '增强你的 CI/CD 工作流，提供高级工作流模板、性能优化和团队协作功能',
    price: 29.99,
    category: 'tools',
    tags: ['CI/CD', 'Automation', 'DevOps'],
    image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=600&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop'
    ],
    stars: 4.8,
    downloads: 15000
  },
  {
    id: '2',
    title: 'Code Review Assistant',
    author: 'DevTools',
    description: 'AI 驱动的智能代码审查工具，自动检测代码质量问题、安全漏洞',
    price: 19.99,
    category: 'plugins',
    tags: ['Code Review', 'AI', 'Quality'],
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop'
    ],
    stars: 4.6,
    downloads: 8000
  },
  {
    id: '3',
    title: 'Git History Visualizer',
    author: 'VisualGit',
    description: '美观的 Git 历史可视化工具，帮助你理解代码演进过程',
    price: 9.99,
    category: 'tools',
    tags: ['Git', 'Visualization', 'Analytics'],
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=600&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=600&fit=crop'
    ],
    stars: 4.7,
    downloads: 12000
  },
  {
    id: '4',
    title: 'Issue Tracker Pro',
    author: 'IssueHub',
    description: '强大的问题追踪和项目管理工具，支持看板、甘特图、团队协作',
    price: 39.99,
    category: 'apps',
    tags: ['Project Management', 'Issues', 'Team'],
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop'
    ],
    stars: 4.9,
    downloads: 20000
  },
  {
    id: '5',
    title: 'Dark Theme Pack',
    author: 'ThemeCraft',
    description: '为 GitHub 带来 10+ 精美的深色主题，保护你的眼睛',
    price: 4.99,
    category: 'themes',
    tags: ['Theme', 'Dark Mode', 'UI'],
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop'
    ],
    stars: 4.5,
    downloads: 25000
  },
  {
    id: '6',
    title: 'Pull Request Enhancer',
    author: 'PRPro',
    description: '增强 Pull Request 体验，提供更强大的代码审查和合并管理功能',
    price: 14.99,
    category: 'plugins',
    tags: ['Pull Request', 'Code Review', 'Workflow'],
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop'
    ],
    stars: 4.4,
    downloads: 9500
  }
];
