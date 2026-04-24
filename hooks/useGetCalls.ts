import { useEffect, useMemo, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';

const getTimestamp = (value?: string | Date) => {
  if (!value) return 0;
  return new Date(value).getTime();
};

export const useGetCalls = () => {
  const { user } = useUser();
  const client = useStreamVideoClient();
  const [calls, setCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(new Date());
    }, 30_000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const loadCalls = async () => {
      if (!client || !user?.id) return;
      
      setIsLoading(true);

      try {
        // https://getstream.io/video/docs/react/guides/querying-calls/#filters
        const { calls } = await client.queryCalls({
          sort: [{ field: 'starts_at', direction: -1 }],
          filter_conditions: {
            starts_at: { $exists: true },
            $or: [
              { created_by_user_id: user.id },
              { members: { $in: [user.id] } },
            ],
          },
        });

        setCalls(calls ?? []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCalls();
  }, [client, user?.id]);

  const endedCalls = useMemo(() => {
    return calls
      .filter(({ state: { endedAt } }: Call) => Boolean(endedAt))
      .sort((a, b) => {
        const aTimestamp = getTimestamp(a.state.endedAt ?? a.state.startsAt);
        const bTimestamp = getTimestamp(b.state.endedAt ?? b.state.startsAt);
        return bTimestamp - aTimestamp;
      });
  }, [calls]);

  const upcomingCalls = useMemo(() => {
    return calls
      .filter(({ state: { startsAt, endedAt } }: Call) => {
        return Boolean(startsAt) && !endedAt && getTimestamp(startsAt) > now.getTime();
      })
      .sort((a, b) => getTimestamp(a.state.startsAt) - getTimestamp(b.state.startsAt));
  }, [calls, now]);

  return { endedCalls, upcomingCalls, callRecordings: calls, isLoading };
};