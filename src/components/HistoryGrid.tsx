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
    <div className="mt-12 w-full max-w-2xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-500">
          历史记录 ({displayHistory.length})
        </h3>
        {onClear && displayHistory.length > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            清空
          </button>
        )}
      </div>
      <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
        {displayHistory.map((avatarUrl, index) => (
          <button
            key={`${avatarUrl}-${index}`}
            onClick={() => onSelect(avatarUrl)}
          >
            <img
              src={avatarUrl}
              alt={`历史头像 ${index + 1}`}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover hover:opacity-80 transition-opacity"
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
