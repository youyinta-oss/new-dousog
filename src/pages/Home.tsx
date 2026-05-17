import React from 'react';
import { AvatarDisplay } from '@/components/AvatarDisplay';
import { RefreshButton } from '@/components/RefreshButton';
import { HistoryGrid } from '@/components/HistoryGrid';
import { useRandomAvatar } from '@/hooks/useRandomAvatar';

export default function Home() {
  const { currentAvatar, history, isLoading, error, fetchRandomAvatar, selectFromHistory } = useRandomAvatar();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
      </div>
      
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            随机头像生成器
          </h1>
          <p className="text-slate-300 text-lg">
            发现令人惊喜的随机头像
          </p>
        </div>

        <div className="mb-10">
          <AvatarDisplay avatarUrl={currentAvatar} isLoading={isLoading} />
        </div>

        <RefreshButton onClick={fetchRandomAvatar} isLoading={isLoading} />

        {error && (
          <div className="mt-6 px-6 py-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
            {error}
          </div>
        )}

        <HistoryGrid 
          history={history} 
          currentAvatar={currentAvatar} 
          onSelect={selectFromHistory}
        />

        <footer className="absolute bottom-6 text-slate-400 text-sm">
          使用 <a href="https://v2.xxapi.cn/api/head" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors">v2.xxapi.cn</a> 提供的 API
        </footer>
      </div>
    </div>
  );
}