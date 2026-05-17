import React, { useCallback, useMemo } from 'react';
import { AvatarDisplay } from '@/components/AvatarDisplay';
import { RefreshButton } from '@/components/RefreshButton';
import { HistoryGrid } from '@/components/HistoryGrid';
import { ActionButtons } from '@/components/ActionButtons';
import { useRandomAvatar } from '@/hooks/useRandomAvatar';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Keyboard } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-x-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-500/25 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-3xl animate-float-reverse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />
      </div>
      
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 sm:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
            <Keyboard className="w-4 h-4 text-purple-300" />
            <span className="text-xs text-slate-300">按空格键快速换一张</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
              随机头像
            </span>
            <span className="text-white/80">生成器</span>
          </h1>
          <p className="text-slate-300 text-lg sm:text-xl max-w-md mx-auto">
            发现令人惊喜的随机头像
          </p>
        </div>

        <div className="mb-8 sm:mb-10">
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
          <div className="mt-6 px-6 py-3 bg-red-500/15 backdrop-blur-sm border border-red-500/30 rounded-xl text-red-200 flex items-center gap-2">
            <span>⚠️</span>
            {error}
          </div>
        )}

        <HistoryGrid 
          history={history} 
          currentAvatar={currentAvatar} 
          onSelect={selectFromHistory}
          onClear={clearHistory}
        />

        <footer className="mt-auto pt-12 sm:pt-16 text-slate-400 text-sm">
          <p>
            使用 <a href="https://v2.xxapi.cn/api/head" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors">v2.xxapi.cn</a> 提供的 API
          </p>
        </footer>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-30px, 30px) scale(0.95); }
          66% { transform: translate(20px, -20px) scale(1.05); }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        .animate-float-reverse {
          animation: float-reverse 25s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}