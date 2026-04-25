/* eslint-disable camelcase */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import HomeCard from './HomeCard';
import MeetingModal from './MeetingModal';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';
import { Textarea } from './ui/textarea';
import ReactDatePicker from 'react-datepicker';
import { useToast } from './ui/use-toast';
import { Input } from './ui/input';
import { getCallType, getMeetingLink } from '@/lib/meeting-utils';
import { HomeCardSkeleton } from './Skeleton';

const initialValues = {
  dateTime: new Date(),
  description: '',
  link: '',
};

const MeetingTypeList = () => {
  const router = useRouter();
  const [meetingState, setMeetingState] = useState<
    'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined
  >(undefined);
  const [values, setValues] = useState(initialValues);
  const [callDetail, setCallDetail] = useState<Call>();
  const [isCreating, setIsCreating] = useState(false);
  const client = useStreamVideoClient();
  const { user } = useUser();
  const { toast } = useToast();

  // Listen for keyboard shortcut events
  useEffect(() => {
    const handleInstantMeeting = () => setMeetingState('isInstantMeeting');
    const handleJoinMeeting = () => setMeetingState('isJoiningMeeting');
    const handleScheduleMeeting = () => setMeetingState('isScheduleMeeting');

    window.addEventListener('open-instant-meeting', handleInstantMeeting);
    window.addEventListener('open-join-meeting', handleJoinMeeting);
    window.addEventListener('open-schedule-meeting', handleScheduleMeeting);

    return () => {
      window.removeEventListener('open-instant-meeting', handleInstantMeeting);
      window.removeEventListener('open-join-meeting', handleJoinMeeting);
      window.removeEventListener('open-schedule-meeting', handleScheduleMeeting);
    };
  }, []);

  const createMeeting = async () => {
    if (!client || !user || !meetingState) return;

    const isInstantMeeting = meetingState === 'isInstantMeeting';

    if (!isInstantMeeting) {
      if (!values.dateTime) {
        toast({ title: 'Please select a date and time' });
        return;
      }

      if (values.dateTime.getTime() <= Date.now()) {
        toast({
          title: 'Please choose a future time',
          description: 'Scheduled meetings must start in the future.',
        });
        return;
      }
    }

    setIsCreating(true);

    try {
      const id = crypto.randomUUID();
      const call = client.call(getCallType(), id);
      if (!call) throw new Error('Failed to create meeting');

      const description = values.description.trim() || (isInstantMeeting ? 'Instant Meeting' : 'Scheduled Meeting');
      const callData: {
        starts_at?: string;
        custom: {
          description: string;
        };
      } = {
        custom: {
          description,
        },
      };

      if (!isInstantMeeting) {
        callData.starts_at = values.dateTime.toISOString();
      }

      await call.getOrCreate({
        data: callData,
      });

      setCallDetail(call);

      if (isInstantMeeting) {
        setMeetingState(undefined);
        router.push(`/meeting/${call.id}`);
        return;
      }

      toast({
        title: 'Meeting Created',
      });
    } catch (error) {
      console.error(error);

      const errorMessage =
        error instanceof Error && error.message
          ? error.message
          : 'Please verify your Stream API credentials and call permissions.';

      toast({
        title: 'Failed to create meeting',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const openScheduleMeeting = () => {
    setCallDetail(undefined);
    setValues({ ...initialValues, dateTime: new Date() });
    setMeetingState('isScheduleMeeting');
  };

  const openInstantMeeting = () => {
    setValues({ ...initialValues, dateTime: new Date() });
    setMeetingState('isInstantMeeting');
  };

  const openJoinMeeting = () => {
    setValues((prev) => ({ ...prev, link: '' }));
    setMeetingState('isJoiningMeeting');
  };

  const joinMeeting = () => {
    const rawLink = values.link.trim();

    if (!rawLink) {
      toast({ title: 'Please paste a meeting link' });
      return;
    }

    try {
      const parsedUrl = new URL(rawLink, window.location.origin);

      if (!parsedUrl.pathname.startsWith('/meeting/')) {
        toast({ title: 'Invalid meeting link', description: 'Please provide a valid Ro0m meeting URL.' });
        return;
      }

      setMeetingState(undefined);
      router.push(`${parsedUrl.pathname}${parsedUrl.search}`);
    } catch {
      toast({ title: 'Invalid meeting link', description: 'Please provide a valid URL.' });
    }
  };

  if (!client || !user) {
    return (
      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <HomeCardSkeleton />
        <HomeCardSkeleton />
        <HomeCardSkeleton />
        <HomeCardSkeleton />
      </section>
    );
  }
  
  const meetingLink = callDetail?.id ? getMeetingLink(callDetail.id) : '';

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard
        img="/icons/add-meeting.svg"
        title="New Meeting"
        description="Start an instant meeting"
        handleClick={openInstantMeeting}
      />
      <HomeCard
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        description="via invitation link"
        handleClick={openJoinMeeting}
      />
      <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        handleClick={openScheduleMeeting}
      />
      <HomeCard
        img="/icons/recordings.svg"
        title="View Recordings"
        description="Meeting Recordings"
        handleClick={() => router.push('/recordings')}
      />

      {!callDetail ? (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Schedule Meeting"
          handleClick={createMeeting}
          buttonText={isCreating ? 'Creating…' : 'Schedule Meeting'}
          isLoading={isCreating}
        >
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-fg-secondary">
              Description
            </label>
            <Textarea
              placeholder="Add a description…"
              className="border border-border-subtle bg-bg-tertiary rounded-swift focus-visible:ring-1 focus-visible:ring-fg-primary/20 focus-visible:ring-offset-0 text-fg-primary placeholder:text-fg-tertiary resize-none"
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
          </div>
          <div className="flex w-full flex-col gap-3">
            <label className="text-sm font-medium text-fg-secondary">
              Date and Time
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => {
                if (!date) return;
                setValues({ ...values, dateTime: date });
              }}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full rounded-swift border border-border-subtle bg-bg-tertiary p-3 text-fg-primary focus:outline-none focus:ring-1 focus:ring-fg-primary/20"
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Meeting Created"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({ title: 'Link Copied' });
          }}
          image={'/icons/checked.svg'}
          buttonIcon="/icons/copy.svg"
          className="text-center"
          buttonText="Copy Meeting Link"
        />
      )}

      <MeetingModal
        isOpen={meetingState === 'isJoiningMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Join Meeting"
        className="text-center"
        buttonText="Join Meeting"
        handleClick={joinMeeting}
      >
        <Input
          placeholder="Paste meeting link here…"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
          className="border border-border-subtle bg-bg-tertiary rounded-swift focus-visible:ring-1 focus-visible:ring-fg-primary/20 focus-visible:ring-offset-0 text-fg-primary placeholder:text-fg-tertiary"
        />
      </MeetingModal>

      <MeetingModal
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Start Instant Meeting"
        className="text-center"
        buttonText={isCreating ? 'Creating…' : 'Start Meeting'}
        handleClick={createMeeting}
        isLoading={isCreating}
      />
    </section>
  );
};

export default MeetingTypeList;

