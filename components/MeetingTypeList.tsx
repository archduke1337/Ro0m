/* eslint-disable camelcase */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import HomeCard from './HomeCard';
import MeetingModal from './MeetingModal';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';
import Loader from './Loader';
import { Textarea } from './ui/textarea';
import ReactDatePicker from 'react-datepicker';
import { useToast } from './ui/use-toast';
import { Input } from './ui/input';
import { getMeetingLink } from '@/lib/meeting-utils';
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
    if (!client || !user) return;
    try {
      if (!values.dateTime) {
        toast({ title: 'Please select a date and time' });
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call('default', id);
      if (!call) throw new Error('Failed to create meeting');
      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || 'Instant Meeting';
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });
      setCallDetail(call);
      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }
      toast({
        title: 'Meeting Created',
      });
    } catch (error) {
      console.error(error);
      toast({ title: 'Failed to create Meeting' });
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
        handleClick={() => setMeetingState('isInstantMeeting')}
      />
      <HomeCard
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        description="via invitation link"
        handleClick={() => setMeetingState('isJoiningMeeting')}
      />
      <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        handleClick={() => setMeetingState('isScheduleMeeting')}
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
        >
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-fg-secondary">
              Description
            </label>
            <Textarea
              placeholder="Add a description..."
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
              onChange={(date) => setValues({ ...values, dateTime: date! })}
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
        handleClick={() => router.push(values.link)}
      >
        <Input
          placeholder="Paste meeting link here..."
          onChange={(e) => setValues({ ...values, link: e.target.value })}
          className="border border-border-subtle bg-bg-tertiary rounded-swift focus-visible:ring-1 focus-visible:ring-fg-primary/20 focus-visible:ring-offset-0 text-fg-primary placeholder:text-fg-tertiary"
        />
      </MeetingModal>

      <MeetingModal
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Start Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />
    </section>
  );
};

export default MeetingTypeList;

