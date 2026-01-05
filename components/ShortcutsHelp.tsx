'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { X } from 'lucide-react';

interface ShortcutGroup {
  title: string;
  shortcuts: {
    keys: string[];
    description: string;
  }[];
}

const shortcutGroups: ShortcutGroup[] = [
  {
    title: 'Navigation',
    shortcuts: [
      { keys: ['G', 'H'], description: 'Go to Home' },
      { keys: ['G', 'U'], description: 'Go to Upcoming' },
      { keys: ['G', 'P'], description: 'Go to Previous' },
      { keys: ['G', 'R'], description: 'Go to Recordings' },
      { keys: ['G', 'M'], description: 'Go to Personal Room' },
    ],
  },
  {
    title: 'Actions',
    shortcuts: [
      { keys: ['N'], description: 'Start new meeting' },
      { keys: ['J'], description: 'Join meeting' },
      { keys: ['S'], description: 'Schedule meeting' },
    ],
  },
  {
    title: 'Meeting Room',
    shortcuts: [
      { keys: ['M'], description: 'Toggle Microphone' },
      { keys: ['V'], description: 'Toggle Video' },
      { keys: ['H'], description: 'Raise/Lower Hand' },
      { keys: ['I'], description: 'Toggle Info Stats' },
    ],
  },
  {
    title: 'General',
    shortcuts: [
      { keys: ['⌘', 'K'], description: 'Open command palette' },
      { keys: ['?'], description: 'Show keyboard shortcuts' },
      { keys: ['ESC'], description: 'Close dialog' },
    ],
  },
];

const ShortcutsHelp = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleShowShortcuts = () => setOpen(true);
    window.addEventListener('show-shortcuts-help', handleShowShortcuts);
    return () => window.removeEventListener('show-shortcuts-help', handleShowShortcuts);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[520px] p-0 border border-border-subtle bg-bg-elevated rounded-swift-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
          <h2 className="text-lg font-semibold text-fg-primary">Keyboard Shortcuts</h2>
          <button 
            onClick={() => setOpen(false)}
            className="p-1 rounded-swift hover:bg-accent-muted transition-colors"
          >
            <X size={18} className="text-fg-tertiary" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="p-6 max-h-[400px] overflow-y-auto">
          <div className="space-y-6">
            {shortcutGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-xs font-medium text-fg-tertiary uppercase tracking-wider mb-3">
                  {group.title}
                </h3>
                <div className="space-y-2">
                  {group.shortcuts.map((shortcut, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between py-2"
                    >
                      <span className="text-sm text-fg-secondary">
                        {shortcut.description}
                      </span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, keyIdx) => (
                          <span key={keyIdx} className="flex items-center">
                            <kbd className="min-w-[24px] px-2 py-1 text-xs font-mono rounded bg-accent-muted text-fg-primary text-center">
                              {key}
                            </kbd>
                            {keyIdx < shortcut.keys.length - 1 && (
                              <span className="mx-1 text-fg-tertiary text-xs">then</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border-subtle px-6 py-4">
          <p className="text-xs text-fg-tertiary text-center">
            Press <kbd className="px-1.5 py-0.5 rounded bg-accent-muted font-mono">?</kbd> anytime to see this help
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShortcutsHelp;
