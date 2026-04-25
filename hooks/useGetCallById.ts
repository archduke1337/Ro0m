import { useEffect, useState } from 'react';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { getCallType } from '@/lib/meeting-utils';

export const useGetCallById = (id?: string | string[] | null) => {
  const [call, setCall] = useState<Call>();
  const [isCallLoading, setIsCallLoading] = useState(true);

  const client = useStreamVideoClient();
  const callId = Array.isArray(id) ? id[0] : id;
  const preferredCallType = getCallType();

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

        if (calls.length > 0) {
          const matchingCall = calls.find((candidate) => candidate.type === preferredCallType);
          setCall(matchingCall || calls[0]);
        } else {
          setCall(undefined);
        }

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
  }, [client, callId, preferredCallType]);

  return { call, isCallLoading };
};
