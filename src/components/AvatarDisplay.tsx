import React from 'react';

interface AvatarDisplayProps {
  avatarUrl: string;
  isLoading: boolean;
  onClick?: () => void;
}

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({ avatarUrl, isLoading, onClick }) => {
  return (
    <div className="flex flex-col items-center">
      <div 
        className={`relative ${onClick && !isLoading ? 'cursor-pointer' : ''}`}
        onClick={!isLoading ? onClick : undefined}
      >
        {isLoading ? (
          <div className="w-56 h-56 md:w-64 md:h-64 rounded-full bg-gray-200 flex items-center justify-center">
            <div className="w-12 h-12 border-3 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
          </div>
        ) : (
          <img
            src={avatarUrl}
            alt="Random Avatar"
            className="w-56 h-56 md:w-64 md:h-64 rounded-full object-cover shadow-lg hover:shadow-xl transition-shadow"
            draggable={false}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://ui-avatars.com/api/?name=Avatar&size=512&background=e5e7eb&color=374151`;
            }}
          />
        )}
      </div>
    </div>
  );
};
