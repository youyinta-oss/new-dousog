import React, { useState, useEffect, useRef } from 'react';

interface AvatarDisplayProps {
  avatarUrl: string;
  isLoading: boolean;
  onClick?: () => void;
}

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({ avatarUrl, isLoading, onClick }) => {
  const [displayUrl, setDisplayUrl] = useState(avatarUrl);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevUrlRef = useRef(avatarUrl);

  useEffect(() => {
    if (avatarUrl !== prevUrlRef.current) {
      setIsTransitioning(true);
      
      const img = new Image();
      img.onload = () => {
        setDisplayUrl(avatarUrl);
        setTimeout(() => setIsTransitioning(false), 300);
      };
      img.onerror = () => {
        setDisplayUrl(`https://ui-avatars.com/api/?name=Avatar&size=512&background=e5e7eb&color=374151`);
        setTimeout(() => setIsTransitioning(false), 300);
      };
      img.src = avatarUrl;
      
      prevUrlRef.current = avatarUrl;
    }
  }, [avatarUrl]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = `https://ui-avatars.com/api/?name=Avatar&size=512&background=e5e7eb&color=374151`;
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        className={`relative ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
      >
        <img
          src={displayUrl}
          alt="Random Avatar"
          className={`w-56 h-56 md:w-64 md:h-64 rounded-full object-cover shadow-lg hover:shadow-xl transition-all duration-300 ${isTransitioning ? 'scale-100' : 'scale-100'}`}
          draggable={false}
          onError={handleError}
        />
        
        {isLoading && (
          <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-gray-700/70 backdrop-blur-sm flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};
