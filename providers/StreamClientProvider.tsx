'use client';

import { ReactNode, useEffect, useState } from 'react';
import { StreamVideoClient, StreamVideo } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';

import { tokenProvider } from '@/actions/stream.actions';
import Loader from '@/components/Loader';

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      setVideoClient(undefined);
      setConnectionError(null);
      return;
    }

    if (!API_KEY) {
      setVideoClient(undefined);
      setConnectionError('Stream API key is missing. Set NEXT_PUBLIC_STREAM_API_KEY.');
      return;
    }

    let mounted = true;
    let client: StreamVideoClient | undefined;

    setVideoClient(undefined);

    const timer = setTimeout(async () => {
      if (!mounted) return;

      try {
        client = new StreamVideoClient({
          apiKey: API_KEY,
          user: {
            id: user.id,
            name: user.username || user.id,
            image: user.imageUrl,
          },
          tokenProvider,
        });

        if (!mounted) {
          await client.disconnectUser();
          return;
        }

        setConnectionError(null);
        setVideoClient(client);
      } catch (error) {
        console.error('Failed to initialize Stream video client:', error);

        if (!mounted) return;

        setVideoClient(undefined);
        setConnectionError('Unable to connect to Stream. Please refresh and try again.');
      }
    }, 50);

    return () => {
      mounted = false;
      clearTimeout(timer);

      if (client) {
        client.disconnectUser().catch((error) => {
          console.error('Failed to disconnect Stream user:', error);
        });
      }
    };
  }, [isLoaded, user?.id, user?.username, user?.imageUrl]);

  if (!isLoaded) return <Loader />;

  if (connectionError) {
    return (
      <div className="flex-center h-screen w-full bg-bg-primary px-6 text-center text-fg-primary">
        <div className="max-w-md rounded-swift-lg border border-border-subtle bg-bg-elevated p-6">
          <h2 className="text-lg font-semibold">Unable to start video client</h2>
          <p className="mt-2 text-sm text-fg-secondary">{connectionError}</p>
        </div>
      </div>
    );
  }

  if (!videoClient) return <Loader />;

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
