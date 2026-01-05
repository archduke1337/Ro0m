'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 p-1 rounded-swift bg-accent-muted border border-border-subtle">
        <div className="size-8 rounded-[8px]" />
        <div className="size-8 rounded-[8px]" />
        <div className="size-8 rounded-[8px]" />
      </div>
    );
  }

  const themes = [
    { id: 'light', icon: Sun, label: 'Light' },
    { id: 'dark', icon: Moon, label: 'Dark' },
    { id: 'system', icon: Monitor, label: 'System' },
  ];

  return (
    <div className="flex items-center gap-1 p-1 rounded-swift bg-accent-muted border border-border-subtle">
      {themes.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => setTheme(id)}
          className={cn(
            'size-8 flex items-center justify-center rounded-[8px] transition-all duration-200',
            theme === id
              ? 'bg-fg-primary text-bg-primary shadow-sm'
              : 'text-fg-tertiary hover:text-fg-secondary'
          )}
          title={label}
          aria-label={`Switch to ${label} theme`}
        >
          <Icon size={16} />
        </button>
      ))}
    </div>
  );
};

export default ThemeToggle;
