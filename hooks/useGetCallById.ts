import { useEffect, useState } from 'react';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';

export const useGetCallById = (id?: string | string[] | null) => {
  const [call, setCall] = useState<Call>();
  const [isCallLoading, setIsCallLoading] = useState(true);

  const client = useStreamVideoClient();
  const callId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    if (!client || !callId) {
      setCall(undefined);
      setIsCallLoading(false);
      return;
    }

    let isCancelled = false;

    const loadCall = async () => {
      setIsCallLoading(true);

      try {
        // https://getstream.io/video/docs/react/guides/querying-calls/#filters
        const { calls } = await client.queryCalls({ filter_conditions: { id: callId } });

        if (isCancelled) return;

        if (calls.length > 0) setCall(calls[0]);
        else setCall(undefined);

        setIsCallLoading(false);
      } catch (error) {
        if (isCancelled) return;

        console.error(error);
        setCall(undefined);
        setIsCallLoading(false);
      }
    };

    loadCall();

    return () => {
      isCancelled = true;
    };
  }, [client, callId]);

  return { call, isCallLoading };
};
