import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Github } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

export function Header() {
  const navigate = useNavigate();
  const itemCount = useCartStore(state => state.getItemCount());

  return (
    <header className="bg-[#0d1117] border-b border-[#30363d] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Github className="w-8 h-8 text-white" />
            <span className="text-xl font-bold text-white">GitHub Store</span>
          </Link>
          
          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索工具、插件、应用..."
                className="w-full bg-[#161b22] border border-[#30363d] rounded-md py-2 pl-10 pr-4 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#238636]"
              />
            </div>
          </div>
          
          <button
            onClick={() => navigate('/cart')}
            className="relative flex items-center gap-2 bg-[#238636] hover:bg-[#2ea043] text-white px-4 py-2 rounded-md transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>购物车</span>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
