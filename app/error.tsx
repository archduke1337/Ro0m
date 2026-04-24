'use client';

import { useEffect } from 'react';

const GlobalError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    console.error('Unhandled route error:', error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg-primary px-6 text-center text-fg-primary">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-system-error">Error</p>
      <h1 className="text-3xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="max-w-md text-sm text-fg-secondary">
        An unexpected error occurred while loading this page.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-swift border border-border-subtle bg-bg-elevated px-4 py-2 text-sm font-medium text-fg-primary transition-colors hover:bg-accent-muted"
      >
        Try again
      </button>
    </main>
  );
};

export default GlobalError;
