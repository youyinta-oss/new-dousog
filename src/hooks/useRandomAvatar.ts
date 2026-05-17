import { useState, useEffect, useCallback } from 'react';

const API_URL = 'https://v2.xxapi.cn/api/head';
const STORAGE_KEY = 'random-avatar-history';
const MAX_HISTORY = 16;

export const useRandomAvatar = () => {
  const [currentAvatar, setCurrentAvatar] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadHistoryFromStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
          if (parsed.length > 0) {
            setCurrentAvatar(parsed[0]);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  }, []);

  const saveHistoryToStorage = useCallback((newHistory: string[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    } catch (err) {
      console.error('Failed to save history:', err);
    }
  }, []);

  const fetchRandomAvatar = useCallback(async (retry = 0) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      
      if (result.code === 200 && result.data) {
        const avatarUrl = result.data;
        setCurrentAvatar(avatarUrl);
        setRetryCount(0);
        
        setHistory(prev => {
          const newHistory = [avatarUrl, ...prev.filter(url => url !== avatarUrl)].slice(0, MAX_HISTORY);
          saveHistoryToStorage(newHistory);
          return newHistory;
        });
      } else {
        throw new Error(result.msg || '获取头像失败');
      }
    } catch (err) {
      if (retry < 2) {
        setRetryCount(retry + 1);
        await new Promise(resolve => setTimeout(resolve, 500 * (retry + 1)));
        return fetchRandomAvatar(retry + 1);
      }
      setError('获取头像失败，请重试');
      console.error('Error fetching avatar:', err);
    } finally {
      setIsLoading(false);
    }
  }, [saveHistoryToStorage]);

  const selectFromHistory = useCallback((avatarUrl: string) => {
    setCurrentAvatar(avatarUrl);
    setError(null);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    saveHistoryToStorage([]);
    fetchRandomAvatar();
  }, [saveHistoryToStorage, fetchRandomAvatar]);

  useEffect(() => {
    loadHistoryFromStorage();
  }, [loadHistoryFromStorage]);

  useEffect(() => {
    if (history.length === 0 && !isLoading) {
      fetchRandomAvatar();
    }
  }, [history.length, isLoading, fetchRandomAvatar]);

  return {
    currentAvatar,
    history,
    isLoading,
    error,
    retryCount,
    fetchRandomAvatar,
    selectFromHistory,
    clearHistory,
  };
};
