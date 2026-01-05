'use client';

import { ReactNode } from 'react';
import CommandPalette from '@/components/CommandPalette';
import KeyboardShortcuts from '@/components/KeyboardShortcuts';
import ShortcutsHelp from '@/components/ShortcutsHelp';

interface ClientProvidersProps {
  children: ReactNode;
}

const ClientProviders = ({ children }: ClientProvidersProps) => {
  return (
    <>
      {children}
      <CommandPalette />
      <KeyboardShortcuts />
      <ShortcutsHelp />
    </>
  );
};

export default ClientProviders;
