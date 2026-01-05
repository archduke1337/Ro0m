import { ReactNode } from 'react';

import StreamVideoProvider from '@/providers/StreamClientProvider';
import ErrorBoundary from '@/components/ErrorBoundary';

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main>
      <ErrorBoundary>
        <StreamVideoProvider>{children}</StreamVideoProvider>
      </ErrorBoundary>
    </main>
  );
};

export default RootLayout;
