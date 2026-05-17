import React, { useState } from 'react';
import { Download, Copy, Check } from 'lucide-react';

interface ActionButtonsProps {
  avatarUrl: string;
  isLoading: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ avatarUrl, isLoading }) => {
  const [copied, setCopied] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await fetch(avatarUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `avatar-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download:', err);
      window.open(avatarUrl, '_blank');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(avatarUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (isLoading) return null;

  return (
    <div className="flex gap-3 mt-6">
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-5 py-3 bg-white/10 backdrop-blur-sm text-white rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
      >
        {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
        <span>{copied ? '已复制' : '复制链接'}</span>
      </button>
      <button
        onClick={handleDownload}
        className="flex items-center gap-2 px-5 py-3 bg-white/10 backdrop-blur-sm text-white rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
      >
        <Download className="w-5 h-5" />
        <span>下载头像</span>
      </button>
    </div>
  );
};
