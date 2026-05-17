import React from 'react';
import { Trash2 } from 'lucide-react';

interface HistoryGridProps {
  history: string[];
  currentAvatar: string;
  onSelect: (avatarUrl: string) => void;
  onClear?: () => void;
}

export const HistoryGrid: React.FC<HistoryGridProps> = ({ history, currentAvatar, onSelect, onClear }) => {
  const displayHistory = history.filter(url => url !== currentAvatar);
  
  if (displayHistory.length === 0) return null;

  return (
    <div className="mt-16 w-full max-w-3xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          历史记录
          <span className="text-sm text-white/40 font-normal">({displayHistory.length})</span>
        </h3>
        {onClear && displayHistory.length > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-lg transition-all duration-200"
          >
            <Trash2 className="w-4 h-4" />
            清空
          </button>
        )}
      </div>
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2 sm:gap-3">
        {displayHistory.map((avatarUrl, index) => (
          <button
            key={`${avatarUrl}-${index}`}
            onClick={() => onSelect(avatarUrl)}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-all duration-300" />
            <img
              src={avatarUrl}
              alt={`历史头像 ${index + 1}`}
              className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl object-cover shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-purple-500/30 border-2 border-white/10 group-hover:border-purple-400/60"
              draggable={false}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
};
