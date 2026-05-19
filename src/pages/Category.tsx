import { useParams } from 'react-router-dom';
import { CategoryFilter } from '../components/CategoryFilter';
import { ProductCard } from '../components/ProductCard';
import { products } from '../data/mockData';
import { Category } from '../types';

const categoryNames: Record<string, string> = {
  tools: '工具',
  plugins: '插件',
  apps: '应用',
  themes: '主题'
};

export function CategoryPage() {
  const { category } = useParams<{ category: Category }>();
  
  const filteredProducts = products.filter(
    product => product.category === category
  );

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {categoryNames[category || ''] || category}
          </h1>
          <p className="text-gray-400">
            共 {filteredProducts.length} 款产品
          </p>
        </div>
        
        <CategoryFilter />
        
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">暂无产品</p>
          </div>
        )}
      </div>
    </div>
  );
}
