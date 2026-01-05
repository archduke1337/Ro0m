'use client';

import { Component, ReactNode } from 'react';
import { Button } from './ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-6 bg-dark-2 text-white">
          <div className="flex flex-col items-center gap-4 rounded-xl bg-dark-1 p-8 text-center">
            <h2 className="text-2xl font-bold">Something went wrong</h2>
            <p className="max-w-md text-sky-1">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <div className="flex gap-4">
              <Button
                onClick={this.handleReset}
                className="bg-blue-1 hover:bg-blue-1/90"
              >
                Try Again
              </Button>
              <Button
                onClick={() => window.location.href = '/'}
                className="bg-dark-3 hover:bg-dark-3/90"
              >
                Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
