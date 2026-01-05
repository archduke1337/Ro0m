'use client';
import { useState } from 'react';
import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import { useRouter, useSearchParams } from 'next/navigation';
import { Users, LayoutList } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import Loader from './Loader';
import EndCallButton from './EndCallButton';
import MeetingReactions from './MeetingReactions';
import { cn } from '@/lib/utils';

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';

const MeetingRoom = () => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get('personal');
  const router = useRouter();
  const [layout, setLayout] = useState<CallLayoutType>('speaker-left');
  const [showParticipants, setShowParticipants] = useState(false);
  const { useCallCallingState } = useCallStateHooks();

  // for more detail about types of CallingState see: https://getstream.io/video/docs/react/ui-cookbook/ringing-call/#incoming-call-panel
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) return <Loader />;

  const CallLayout = () => {
    switch (layout) {
      case 'grid':
        return <PaginatedGridLayout />;
      case 'speaker-right':
        return <SpeakerLayout participantsBarPosition="left" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-bg-primary pt-4 text-fg-primary">
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center">
          <CallLayout />
        </div>
        <div
          className={cn('h-[calc(100vh-86px)] hidden ml-2', {
            'show-block': showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>
      
      {/* Video layout and call controls */}
      <div className="fixed bottom-0 flex w-full items-center justify-center gap-3 pb-6">
        <CallControls onLeave={() => router.push(`/`)} />

        {/* Reactions */}
        <MeetingReactions />

        <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger className="cursor-pointer rounded-swift bg-accent-muted border border-border-subtle p-3 hover:bg-accent-hover transition-colors">
              <LayoutList size={18} className="text-fg-primary" />
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className="border-border-subtle bg-bg-elevated text-fg-primary rounded-swift">
            {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item, index) => (
              <div key={index}>
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-accent-muted rounded-swift text-sm"
                  onClick={() =>
                    setLayout(item.toLowerCase() as CallLayoutType)
                  }
                >
                  {item}
                </DropdownMenuItem>
                {index < 2 && <DropdownMenuSeparator className="bg-border-subtle" />}
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <CallStatsButton />
        
        <button 
          onClick={() => setShowParticipants((prev) => !prev)}
          className="cursor-pointer rounded-swift bg-accent-muted border border-border-subtle p-3 hover:bg-accent-hover transition-colors"
        >
          <Users size={18} className="text-fg-primary" />
        </button>
        
        {!isPersonalRoom && <EndCallButton />}
      </div>
    </section>
  );
};

export default MeetingRoom;

