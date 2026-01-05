'use client';

import { useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Global keyboard shortcuts hook
export const useKeyboardShortcuts = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      return;
    }

    // G + key combinations for navigation
    if (e.key === 'g' || e.key === 'G') {
      // Set up listener for next key
      const handleNextKey = (nextE: KeyboardEvent) => {
        window.removeEventListener('keydown', handleNextKey);
        
        switch (nextE.key.toLowerCase()) {
          case 'h':
            e.preventDefault();
            router.push('/');
            break;
          case 'u':
            e.preventDefault();
            router.push('/upcoming');
            break;
          case 'p':
            e.preventDefault();
            router.push('/previous');
            break;
          case 'r':
            e.preventDefault();
            router.push('/recordings');
            break;
          case 'm':
            e.preventDefault();
            router.push('/personal-room');
            break;
        }
      };

      // Listen for next key within 500ms
      window.addEventListener('keydown', handleNextKey);
      setTimeout(() => {
        window.removeEventListener('keydown', handleNextKey);
      }, 500);
      return;
    }

    // Single key shortcuts
    switch (e.key.toLowerCase()) {
      case 'n':
        // New meeting
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('open-instant-meeting'));
        break;
      case 'j':
        // Join meeting
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('open-join-meeting'));
        break;
      case 's':
        // Schedule meeting
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('open-schedule-meeting'));
        break;
      case '?':
        // Show keyboard shortcuts help
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('show-shortcuts-help'));
        break;
    }
  }, [router]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

// Keyboard shortcuts provider component
const KeyboardShortcuts = () => {
  useKeyboardShortcuts();
  return null;
};

export default KeyboardShortcuts;
