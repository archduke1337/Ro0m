import Link from 'next/link';

const NotFound = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg-primary px-6 text-center text-fg-primary">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-fg-tertiary">404</p>
      <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="max-w-md text-sm text-fg-secondary">
        The page you requested does not exist or may have been moved.
      </p>
      <Link
        href="/"
        className="rounded-swift border border-border-subtle bg-bg-elevated px-4 py-2 text-sm font-medium text-fg-primary transition-colors hover:bg-accent-muted"
      >
        Return home
      </Link>
    </main>
  );
};

export default NotFound;
