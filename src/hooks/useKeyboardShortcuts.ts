import { useEffect } from 'react';

export const useKeyboardShortcuts = (shortcuts: { [key: string]: () => void }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      if (shortcuts[key] && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        shortcuts[key]();
      }
      
      if (e.code === 'Space' && shortcuts['space'] && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        shortcuts['space']();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};
