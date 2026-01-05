'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Dialog, DialogContent } from './ui/dialog';
import { 
  Video, 
  Users, 
  Calendar, 
  Clock, 
  Home, 
  Plus,
  Link as LinkIcon,
  Sun,
  Moon,
  Monitor,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useClerk } from '@clerk/nextjs';

interface CommandItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
  category: 'navigation' | 'actions' | 'theme' | 'account';
}

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const { signOut } = useClerk();
  const { setTheme } = useTheme();

  const navigate = useCallback((path: string) => {
    router.push(path);
    setOpen(false);
    setSearch('');
  }, [router]);

  const commands: CommandItem[] = [
    // Navigation
    {
      id: 'home',
      label: 'Go to Home',
      icon: <Home size={18} />,
      shortcut: 'G H',
      action: () => navigate('/'),
      category: 'navigation',
    },
    {
      id: 'upcoming',
      label: 'View Upcoming Meetings',
      icon: <Calendar size={18} />,
      shortcut: 'G U',
      action: () => navigate('/upcoming'),
      category: 'navigation',
    },
    {
      id: 'previous',
      label: 'View Previous Meetings',
      icon: <Clock size={18} />,
      shortcut: 'G P',
      action: () => navigate('/previous'),
      category: 'navigation',
    },
    {
      id: 'recordings',
      label: 'View Recordings',
      icon: <Video size={18} />,
      shortcut: 'G R',
      action: () => navigate('/recordings'),
      category: 'navigation',
    },
    {
      id: 'personal-room',
      label: 'Personal Room',
      icon: <Users size={18} />,
      shortcut: 'G M',
      action: () => navigate('/personal-room'),
      category: 'navigation',
    },
    // Actions
    {
      id: 'new-meeting',
      label: 'Start Instant Meeting',
      icon: <Plus size={18} />,
      shortcut: 'N',
      action: () => {
        setOpen(false);
        // Trigger the new meeting modal - dispatch custom event
        window.dispatchEvent(new CustomEvent('open-instant-meeting'));
      },
      category: 'actions',
    },
    {
      id: 'join-meeting',
      label: 'Join Meeting',
      icon: <LinkIcon size={18} />,
      shortcut: 'J',
      action: () => {
        setOpen(false);
        window.dispatchEvent(new CustomEvent('open-join-meeting'));
      },
      category: 'actions',
    },
    {
      id: 'schedule-meeting',
      label: 'Schedule Meeting',
      icon: <Calendar size={18} />,
      shortcut: 'S',
      action: () => {
        setOpen(false);
        window.dispatchEvent(new CustomEvent('open-schedule-meeting'));
      },
      category: 'actions',
    },
    // Theme
    {
      id: 'theme-light',
      label: 'Switch to Light Mode',
      icon: <Sun size={18} />,
      action: () => {
        setTheme('light');
        setOpen(false);
      },
      category: 'theme',
    },
    {
      id: 'theme-dark',
      label: 'Switch to Dark Mode',
      icon: <Moon size={18} />,
      action: () => {
        setTheme('dark');
        setOpen(false);
      },
      category: 'theme',
    },
    {
      id: 'theme-system',
      label: 'Use System Theme',
      icon: <Monitor size={18} />,
      action: () => {
        setTheme('system');
        setOpen(false);
      },
      category: 'theme',
    },
    // Account
    {
      id: 'sign-out',
      label: 'Sign Out',
      icon: <LogOut size={18} />,
      action: () => signOut({ redirectUrl: '/sign-in' }),
      category: 'account',
    },
  ];

  // Filter commands based on search
  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase())
  );

  // Group by category
  const groupedCommands = {
    navigation: filteredCommands.filter((c) => c.category === 'navigation'),
    actions: filteredCommands.filter((c) => c.category === 'actions'),
    theme: filteredCommands.filter((c) => c.category === 'theme'),
    account: filteredCommands.filter((c) => c.category === 'account'),
  };

  // Open command palette with ⌘K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle navigation within the palette
  useEffect(() => {
    if (!open) {
      setSelectedIndex(0);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => 
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => 
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
          }
          break;
        case 'Escape':
          setOpen(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, filteredCommands, selectedIndex]);

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  const renderCategory = (
    title: string, 
    items: CommandItem[], 
    startIndex: number
  ) => {
    if (items.length === 0) return null;
    
    return (
      <div className="mb-2">
        <div className="px-3 py-2 text-xs font-medium text-fg-tertiary uppercase tracking-wider">
          {title}
        </div>
        {items.map((item, idx) => {
          const globalIndex = startIndex + idx;
          const isSelected = selectedIndex === globalIndex;
          
          return (
            <button
              key={item.id}
              onClick={item.action}
              onMouseEnter={() => setSelectedIndex(globalIndex)}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2.5 rounded-swift text-sm transition-colors',
                isSelected 
                  ? 'bg-fg-primary text-bg-primary' 
                  : 'text-fg-secondary hover:bg-accent-muted'
              )}
            >
              <div className="flex items-center gap-3">
                <span className={cn(isSelected ? 'text-bg-primary' : 'text-fg-tertiary')}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
              </div>
              {item.shortcut && (
                <div className="flex items-center gap-1">
                  {item.shortcut.split(' ').map((key, i) => (
                    <kbd
                      key={i}
                      className={cn(
                        'px-1.5 py-0.5 text-xs rounded font-mono',
                        isSelected 
                          ? 'bg-bg-primary/20 text-bg-primary' 
                          : 'bg-accent-muted text-fg-tertiary'
                      )}
                    >
                      {key}
                    </kbd>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  // Calculate start indices for each category
  let navigationStart = 0;
  let actionsStart = groupedCommands.navigation.length;
  let themeStart = actionsStart + groupedCommands.actions.length;
  let accountStart = themeStart + groupedCommands.theme.length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[560px] p-0 border border-border-subtle bg-bg-elevated rounded-swift-xl overflow-hidden">
        {/* Search Input */}
        <div className="border-b border-border-subtle p-4">
          <div className="flex items-center gap-3">
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 20 20" 
              fill="none" 
              className="text-fg-tertiary"
            >
              <path 
                d="M17.5 17.5L12.5 12.5M14.1667 8.33333C14.1667 11.555 11.555 14.1667 8.33333 14.1667C5.11167 14.1667 2.5 11.555 2.5 8.33333C2.5 5.11167 5.11167 2.5 8.33333 2.5C11.555 2.5 14.1667 5.11167 14.1667 8.33333Z" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Type a command or search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-fg-primary text-base placeholder:text-fg-tertiary focus:outline-none"
              autoFocus
            />
            <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs rounded bg-accent-muted text-fg-tertiary font-mono">
              ESC
            </kbd>
          </div>
        </div>

        {/* Commands List */}
        <div className="max-h-[360px] overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-fg-tertiary text-sm">
              No commands found for &quot;{search}&quot;
            </div>
          ) : (
            <>
              {renderCategory('Navigation', groupedCommands.navigation, navigationStart)}
              {renderCategory('Actions', groupedCommands.actions, actionsStart)}
              {renderCategory('Theme', groupedCommands.theme, themeStart)}
              {renderCategory('Account', groupedCommands.account, accountStart)}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border-subtle px-4 py-3 flex items-center justify-between text-xs text-fg-tertiary">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-accent-muted font-mono">↑↓</kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-accent-muted font-mono">↵</kbd>
              select
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-accent-muted font-mono">⌘</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-accent-muted font-mono">K</kbd>
            to toggle
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommandPalette;
