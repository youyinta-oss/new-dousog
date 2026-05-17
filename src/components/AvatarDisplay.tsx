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
        className={`relative group ${onClick && !isLoading ? 'cursor-pointer' : ''}`}
        onClick={!isLoading ? onClick : undefined}
      >
        <div className="absolute -inset-8 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-all duration-700 animate-pulse" />
        <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-500" />
        <div className="relative">
          {isLoading ? (
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm flex items-center justify-center border border-white/10">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-purple-500/30 border-t-purple-400 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 border-3 border-pink-500/30 border-t-pink-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
                </div>
              </div>
            </div>
          ) : (
            <img
              src={avatarUrl}
              alt="Random Avatar"
              className="w-64 h-64 md:w-80 md:h-80 rounded-full object-cover shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-purple-500/25 border-4 border-white/20 group-hover:border-white/40 select-none"
              draggable={false}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=Random&size=512&background=667eea&color=fff`;
              }}
            />
          )}
        </div>
        {onClick && !isLoading && (
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <span className="text-white/60 text-sm whitespace-nowrap">点击头像换一张</span>
          </div>
        )}
      </div>
    </div>
  );
};
