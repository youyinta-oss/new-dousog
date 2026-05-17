import React from 'react';
import { RefreshCw } from 'lucide-react';

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
      className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 active:bg-gray-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <>
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>
            {retryCount > 0 ? `重试中...` : '加载中...'}
          </span>
        </>
      ) : (
        <>
          <RefreshCw className="w-5 h-5" />
          <span>换一张</span>
        </>
      )}
    </button>
  );
};
