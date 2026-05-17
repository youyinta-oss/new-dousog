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
    <div className="flex gap-3 mt-5">
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
      >
        {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
        <span className="text-sm">{copied ? '已复制' : '复制链接'}</span>
      </button>
      <button
        onClick={handleDownload}
        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Download className="w-4 h-4" />
        <span className="text-sm">下载</span>
      </button>
    </div>
  );
};
