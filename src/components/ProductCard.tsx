import { useNavigate } from 'react-router-dom';
import { Star, Download } from 'lucide-react';
import { Product } from '../types';
import { useCartStore } from '../store/useCartStore';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const addToCart = useCartStore(state => state.addToCart);

  return (
    <div 
      className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden hover:border-[#238636] transition-colors cursor-pointer group"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-[#0d1117] bg-opacity-80 px-2 py-1 rounded text-white text-sm font-bold">
          ${product.price}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-[#238636] transition-colors">
          {product.title}
        </h3>
        <p className="text-gray-400 text-sm mb-2">by {product.author}</p>
        
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span>{product.stars}</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="w-4 h-4" />
            <span>{(product.downloads / 1000).toFixed(0)}K</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {product.tags.slice(0, 3).map(tag => (
            <span 
              key={tag}
              className="bg-[#30363d] text-gray-300 text-xs px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product);
          }}
          className="w-full bg-[#238636] hover:bg-[#2ea043] text-white py-2 rounded-md transition-colors font-medium"
        >
          加入购物车
        </button>
      </div>
    </div>
  );
}
