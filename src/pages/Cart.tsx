import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

export function CartPage() {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, getTotal } = useCartStore();

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          继续购物
        </button>
        
        <h1 className="text-3xl font-bold text-white mb-8">购物车</h1>
        
        {items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">购物车是空的</h2>
            <p className="text-gray-400 mb-6">快去浏览一些精彩的产品吧！</p>
            <button
              onClick={() => navigate('/')}
              className="bg-[#238636] hover:bg-[#2ea043] text-white px-6 py-2 rounded-md transition-colors"
            >
              开始购物
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div 
                key={item.product.id}
                className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex items-center gap-4"
              >
                <img 
                  src={item.product.image} 
                  alt={item.product.title}
                  className="w-24 h-24 object-cover rounded"
                />
                
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{item.product.title}</h3>
                  <p className="text-gray-400 text-sm">by {item.product.author}</p>
                  <p className="text-[#238636] font-bold mt-1">${item.product.price}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center bg-[#30363d] hover:bg-[#484f58] text-white rounded transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-white font-medium w-8 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center bg-[#30363d] hover:bg-[#484f58] text-white rounded transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="text-right">
                  <p className="text-white font-bold">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 mt-8">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-400 text-lg">总计</span>
                <span className="text-3xl font-bold text-white">
                  ${getTotal().toFixed(2)}
                </span>
              </div>
              
              <button className="w-full bg-[#238636] hover:bg-[#2ea043] text-white py-4 rounded-md transition-colors font-semibold text-lg">
                结算
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
