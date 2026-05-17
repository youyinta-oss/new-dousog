import React from 'react';

interface AvatarDisplayProps {
  avatarUrl: string;
  isLoading: boolean;
}

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({ avatarUrl, isLoading }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
        <div className="relative">
          {isLoading ? (
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <img
              src={avatarUrl}
              alt="Random Avatar"
              className="w-64 h-64 md:w-80 md:h-80 rounded-full object-cover shadow-2xl transition-transform duration-300 group-hover:scale-105 border-4 border-white/20"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=Avatar&size=512&background=667eea&color=fff`;
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
