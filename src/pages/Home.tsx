import React, { useCallback, useMemo } from 'react';
import { AvatarDisplay } from '@/components/AvatarDisplay';
import { RefreshButton } from '@/components/RefreshButton';
import { HistoryGrid } from '@/components/HistoryGrid';
import { ActionButtons } from '@/components/ActionButtons';
import { useRandomAvatar } from '@/hooks/useRandomAvatar';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export default function Home() {
  const { 
    currentAvatar, 
    history, 
    isLoading, 
    error, 
    retryCount,
    fetchRandomAvatar, 
    selectFromHistory,
    clearHistory
  } = useRandomAvatar();

  const shortcuts = useMemo(() => ({
    space: fetchRandomAvatar,
    'r': fetchRandomAvatar,
    'n': fetchRandomAvatar,
  }), [fetchRandomAvatar]);

  useKeyboardShortcuts(shortcuts);

  const handleAvatarClick = useCallback(() => {
    if (!isLoading) {
      fetchRandomAvatar();
    }
  }, [isLoading, fetchRandomAvatar]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            随机头像生成器
          </h1>
          <p className="text-gray-500">
            按空格键换一张
          </p>
        </div>

        <div className="mb-8">
          <AvatarDisplay 
            avatarUrl={currentAvatar} 
            isLoading={isLoading} 
            onClick={handleAvatarClick}
          />
        </div>

        <RefreshButton 
          onClick={fetchRandomAvatar} 
          isLoading={isLoading}
          retryCount={retryCount}
        />

        {!isLoading && currentAvatar && (
          <ActionButtons avatarUrl={currentAvatar} isLoading={isLoading} />
        )}

        {error && (
          <div className="mt-6 px-5 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <HistoryGrid 
          history={history} 
          currentAvatar={currentAvatar} 
          onSelect={selectFromHistory}
          onClear={clearHistory}
        />

        <footer className="mt-auto pt-12 text-gray-400 text-sm">
          <p>
            API 由 <a href="https://v2.xxapi.cn/api/head" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">v2.xxapi.cn</a> 提供
          </p>
        </footer>
      </div>
    </div>
  );
}