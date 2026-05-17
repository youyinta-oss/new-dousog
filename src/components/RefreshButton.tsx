import React from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';

interface RefreshButtonProps {
  onClick: () => void;
  isLoading: boolean;
  retryCount?: number;
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({ onClick, isLoading, retryCount = 0 }) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-[length:200%_200%] text-white font-semibold rounded-full shadow-lg hover:shadow-purple-500/25 hover:shadow-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-500 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 animate-gradient-shift"
    >
      {isLoading ? (
        <>
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>
            {retryCount > 0 ? `重试中... (${retryCount}/2)` : '加载中...'}
          </span>
        </>
      ) : (
        <>
          <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          <span>换一张</span>
        </>
      )}
      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-shift {
          animation: gradient-shift 3s ease infinite;
        }
      `}</style>
    </button>
  );
};
