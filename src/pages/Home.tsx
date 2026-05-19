import { CategoryFilter } from '../components/CategoryFilter';
import { ProductCard } from '../components/ProductCard';
import { products } from '../data/mockData';

export function Home() {
  return (
    <div className="min-h-screen bg-[#0d1117]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            发现优秀的 GitHub 工具
          </h1>
          <p className="text-gray-400 text-lg">
            浏览数千款精心打造的工具、插件和应用
          </p>
        </div>
        
        <CategoryFilter />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
