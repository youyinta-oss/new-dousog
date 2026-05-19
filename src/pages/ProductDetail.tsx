import { useParams, useNavigate } from 'react-router-dom';
import { Star, Download, ArrowLeft } from 'lucide-react';
import { products } from '../data/mockData';
import { useCartStore } from '../store/useCartStore';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addToCart = useCartStore(state => state.addToCart);
  
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">产品未找到</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-[#238636] hover:bg-[#2ea043] text-white px-6 py-2 rounded-md transition-colors"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          返回
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden mb-6">
              <img 
                src={product.image} 
                alt={product.title}
                className="w-full h-96 object-cover"
              />
            </div>
            
            {product.screenshots.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {product.screenshots.map((screenshot, index) => (
                  <div key={index} className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
                    <img 
                      src={screenshot} 
                      alt={`截图 ${index + 1}`}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-8 bg-[#161b22] border border-[#30363d] rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">描述</h2>
              <p className="text-gray-300 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 sticky top-24">
              <h1 className="text-2xl font-bold text-white mb-2">
                {product.title}
              </h1>
              <p className="text-gray-400 mb-4">by {product.author}</p>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-white font-medium">{product.stars}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-400">{(product.downloads / 1000).toFixed(0)}K 下载</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {product.tags.map(tag => (
                  <span 
                    key={tag}
                    className="bg-[#30363d] text-gray-300 text-sm px-3 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="text-3xl font-bold text-white mb-6">
                ${product.price}
              </div>
              
              <button
                onClick={() => {
                  addToCart(product);
                  navigate('/cart');
                }}
                className="w-full bg-[#238636] hover:bg-[#2ea043] text-white py-3 rounded-md transition-colors font-semibold text-lg"
              >
                立即购买
              </button>
              
              <button
                onClick={() => addToCart(product)}
                className="w-full mt-3 bg-[#30363d] hover:bg-[#484f58] text-white py-3 rounded-md transition-colors font-medium"
              >
                加入购物车
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
