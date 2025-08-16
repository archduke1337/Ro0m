'use client';

import { Call, CallRecording } from '@stream-io/video-react-sdk';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import Loader from './Loader';
import { useGetCalls } from '@/hooks/useGetCalls';
import MeetingCard from './MeetingCard';
import { getMeetingLink } from '@/lib/meeting-utils';
import { useToast } from './ui/use-toast';

const CallList = ({ type }: { type: 'ended' | 'upcoming' | 'recordings' }) => {
  const router = useRouter();
  const { endedCalls, upcomingCalls, callRecordings, isLoading } =
    useGetCalls();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);

  const getCalls = () => {
    switch (type) {
      case 'ended':
        return endedCalls;
      case 'recordings':
        return recordings;
      case 'upcoming':
        return upcomingCalls;
      default:
        return [];
    }
  };

  const getNoCallsMessage = () => {
    switch (type) {
      case 'ended':
        return 'No Previous Calls';
      case 'upcoming':
        return 'No Upcoming Calls';
      case 'recordings':
        return 'No Recordings';
      default:
        return '';
    }
  };

  const { toast } = useToast();

  useEffect(() => {
    const fetchRecordings = async () => {
      if (!callRecordings?.length) {
        setRecordings([]);
        return;
      }

      try {
        const callData = await Promise.all(
          callRecordings.map((meeting) => 
            meeting.queryRecordings().catch(error => {
              console.error('Error fetching recording:', error);
              return { recordings: [] };
            })
          )
        );

        const newRecordings = callData
          .filter((call) => call.recordings?.length > 0)
          .flatMap((call) => call.recordings);

        setRecordings(newRecordings);
      } catch (error) {
        console.error('Error fetching recordings:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch recordings. Please try again.',
          variant: 'destructive',
        });
        setRecordings([]);
      }
    };

    if (type === 'recordings') {
      fetchRecordings();
    }
  }, [type, callRecordings, toast]);

  if (isLoading) return <Loader />;

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording) => {
          const isRecording = type === 'recordings';
          const title = isRecording
            ? (meeting as CallRecording).filename?.substring(0, 20) || 'No Description'
            : (meeting as Call).state?.custom?.description || 'No Description';
          const date = isRecording
            ? (meeting as CallRecording).start_time?.toLocaleString() || 'No date'
            : (meeting as Call).state?.startsAt?.toLocaleString() || 'No date';
          
          return (
          <MeetingCard
            key={isRecording ? (meeting as CallRecording).url : (meeting as Call).id}
            icon={
              type === 'ended'
                ? '/icons/previous.svg'
                : type === 'upcoming'
                  ? '/icons/upcoming.svg'
                  : '/icons/recordings.svg'
            }
            title={title}
            date={date}
            isPreviousMeeting={type === 'ended'}
            link={isRecording ? (meeting as CallRecording).url : getMeetingLink((meeting as Call).id)}
            buttonIcon1={isRecording ? '/icons/play.svg' : undefined}
            buttonText={isRecording ? 'Play' : 'Start'}
            handleClick={
              isRecording 
                ? () => {
                    const url = (meeting as CallRecording).url;
                    if (url) {
                      router.push(url);
                    } else {
                      toast({
                        title: 'Error',
                        description: 'Recording URL not found',
                        variant: 'destructive'
                      });
                    }
                  }
                : undefined
            }
          />
        ))}
      ) : (
        <p className="col-span-full text-center text-white">{noCallsMessage}</p>
      )}
    </div>
  );
                : () => router.push(`/meeting/${(meeting as Call).id}`)
            }
          />
        ))
      ) : (
        <h1 className="text-2xl font-bold text-white">{noCallsMessage}</h1>
      )}
    </div>
  );
};

export default CallList;
