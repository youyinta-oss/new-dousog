import { useState, useEffect, useCallback } from 'react';

const API_URL = 'https://v2.xxapi.cn/api/head';

export const useRandomAvatar = () => {
  const [currentAvatar, setCurrentAvatar] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRandomAvatar = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const timestamp = Date.now();
      const avatarUrl = `${API_URL}?t=${timestamp}`;
      setCurrentAvatar(avatarUrl);
      
      setHistory(prev => {
        const newHistory = [avatarUrl, ...prev.filter(url => url !== avatarUrl)];
        return newHistory.slice(0, 12);
      });
    } catch (err) {
      setError('获取头像失败，请重试');
      console.error('Error fetching avatar:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const selectFromHistory = useCallback((avatarUrl: string) => {
    setCurrentAvatar(avatarUrl);
  }, []);

  useEffect(() => {
    fetchRandomAvatar();
  }, [fetchRandomAvatar]);

  return {
    currentAvatar,
    history,
    isLoading,
    error,
    fetchRandomAvatar,
    selectFromHistory,
  };
};
