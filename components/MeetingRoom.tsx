'use client';
import { useState, useCallback } from 'react';
import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCall,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import { useRouter, useSearchParams } from 'next/navigation';
import { Users, LayoutList, Hand } from 'lucide-react';

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
import { useSounds } from '@/hooks/useSounds';
import { useEffect } from 'react';

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';

const MeetingRoom = () => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get('personal');
  const router = useRouter();
  const call = useCall();
  const [layout, setLayout] = useState<CallLayoutType>('speaker-left');
  const [showParticipants, setShowParticipants] = useState(false);
  const { useCallCallingState, useLocalParticipant } = useCallStateHooks();
  const { playSound } = useSounds();

  const localParticipant = useLocalParticipant();
  const isHandRaised = (localParticipant as any)?.isHandRaised;

  const callingState = useCallCallingState();

  // Handle participant join/leave sounds
  useEffect(() => {
    if (!call) return;

    const unsubscribe = call.on('call.session_participant_joined', (event) => {
      // Don't play for local participant
      if (event.participant.user.id !== localParticipant?.userId) {
        playSound('join');
      }
    });

    const unsubscribeLeave = call.on('call.session_participant_left', () => {
      playSound('leave');
    });

    return () => {
      unsubscribe();
      unsubscribeLeave();
    };
  }, [call, localParticipant?.userId, playSound]);

  const toggleHand = useCallback(async () => {
    if (!call) return;
    try {
      if (isHandRaised) {
        await (call as any).lowerHand();
        playSound('click');
      } else {
        await (call as any).raiseHand();
        playSound('hand');
      }
    } catch (error) {
      console.error('Failed to toggle hand:', error);
    }
  }, [call, isHandRaised, playSound]);

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
      <div className="fixed bottom-0 flex w-full flex-wrap items-center justify-center gap-3 pb-6 px-4">
        <CallControls onLeave={() => router.push(`/`)} />

        {/* Reactions */}
        <MeetingReactions />

        {/* Raise Hand */}
        <button
          onClick={toggleHand}
          className={cn(
            'cursor-pointer rounded-swift p-3 transition-all duration-200 border',
            isHandRaised 
              ? 'bg-system-warning border-system-warning text-black shadow-[0_0_15px_rgba(255,214,10,0.3)]' 
              : 'bg-accent-muted border-border-subtle hover:bg-accent-hover text-fg-primary'
          )}
          title={isHandRaised ? 'Lower Hand' : 'Raise Hand'}
        >
          <Hand 
            size={18} 
            className={cn(isHandRaised && 'fill-current animate-bounce-subtle')} 
          />
        </button>

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
          className={cn(
            'cursor-pointer rounded-swift border p-3 transition-colors',
            showParticipants 
              ? 'bg-fg-primary text-bg-primary border-fg-primary' 
              : 'bg-accent-muted border-border-subtle hover:bg-accent-hover text-fg-primary'
          )}
        >
          <Users size={18} />
        </button>
        
        {!isPersonalRoom && <EndCallButton />}
      </div>
    </section>
  );
};

export default MeetingRoom;


