import { Link, useLocation } from 'react-router-dom';
import { Category } from '../types';

const categories: { value: Category; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'tools', label: '工具' },
  { value: 'plugins', label: '插件' },
  { value: 'apps', label: '应用' },
  { value: 'themes', label: '主题' }
];

interface CategoryFilterProps {
  currentCategory?: Category;
}

export function CategoryFilter({ currentCategory }: CategoryFilterProps) {
  const location = useLocation();

  const getLink = (cat: Category) => {
    if (cat === 'all') return '/';
    return `/category/${cat}`;
  };

  const isActive = (cat: Category) => {
    if (cat === 'all') {
      return location.pathname === '/';
    }
    return location.pathname === `/category/${cat}`;
  };

  return (
    <nav className="flex gap-2 mb-8 overflow-x-auto pb-2">
      {categories.map(({ value, label }) => (
        <Link
          key={value}
          to={getLink(value)}
          className={`px-4 py-2 rounded-md font-medium whitespace-nowrap transition-colors ${
            isActive(value)
              ? 'bg-[#238636] text-white'
              : 'bg-[#161b22] border border-[#30363d] text-gray-300 hover:border-[#238636]'
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
