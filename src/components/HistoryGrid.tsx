import React from 'react';

interface HistoryGridProps {
  history: string[];
  currentAvatar: string;
  onSelect: (avatarUrl: string) => void;
}

export const HistoryGrid: React.FC<HistoryGridProps> = ({ history, currentAvatar, onSelect }) => {
  if (history.length <= 1) return null;

  return (
    <div className="mt-12">
      <h3 className="text-lg font-semibold text-white mb-4 text-center">历史头像</h3>
      <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
        {history.filter(url => url !== currentAvatar).map((avatarUrl, index) => (
          <button
            key={`${avatarUrl}-${index}`}
            onClick={() => onSelect(avatarUrl)}
            className="relative group"
          >
            <img
              src={avatarUrl}
              alt={`历史头像 ${index + 1}`}
              className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg border-2 border-transparent group-hover:border-purple-400"
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
