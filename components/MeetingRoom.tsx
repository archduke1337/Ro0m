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
import { Users, LayoutList, Hand, Mic, MicOff, Video, VideoOff, Activity } from 'lucide-react';

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
import KeyboardHUD from './KeyboardHUD';
import MeetingStatsHUD from './MeetingStatsHUD';
import AudioVisualizer from './AudioVisualizer';
import DynamicIsland from './DynamicIsland';
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
  const [showStats, setShowStats] = useState(false);
  const { 
    useCallCallingState, 
    useLocalParticipant,
    useMicrophoneState,
    useCameraState 
  } = useCallStateHooks();
  const { playSound } = useSounds();

  const localParticipant = useLocalParticipant();
  const isHandRaised = (localParticipant as any)?.isHandRaised;
  const { microphone, isMute } = useMicrophoneState();
  const { camera, isMute: isCameraMute } = useCameraState();

  const callingState = useCallCallingState();

  // Handle participant join/leave sounds & Dynamic Island
  useEffect(() => {
    if (!call) return;

    const unsubscribe = call.on('call.session_participant_joined', (event) => {
      // Don't play for local participant
      if (event.participant.user.id !== localParticipant?.userId) {
        playSound('join');
        window.dispatchEvent(new CustomEvent('dynamic-island', {
          detail: { 
            label: `${event.participant.user.name || 'someone'} joined`, 
            icon: Users,
            type: 'info'
          }
        }));
      }
    });

    const unsubscribeLeave = call.on('call.session_participant_left', (event) => {
      playSound('leave');
      window.dispatchEvent(new CustomEvent('dynamic-island', {
        detail: { 
          label: `${event.participant.user.name || 'Someone'} left`, 
          icon: Users,
          type: 'info'
        }
      }));
    });

    const unsubscribeRecording = call.on('call.recording_started', () => {
      window.dispatchEvent(new CustomEvent('dynamic-island', {
        detail: { 
          label: 'Recording started', 
          type: 'recording',
          duration: 5000
        }
      }));
    });

    return () => {
      unsubscribe();
      unsubscribeLeave();
      unsubscribeRecording();
    };
  }, [call, localParticipant?.userId, playSound]);

  const toggleHand = useCallback(async () => {
    if (!call) return;
    try {
      if (isHandRaised) {
        await (call as any).lowerHand();
        playSound('click');
        window.dispatchEvent(new CustomEvent('show-hud', { 
          detail: { label: 'Hand Lowered', icon: Hand, active: false } 
        }));
      } else {
        await (call as any).raiseHand();
        playSound('hand');
        window.dispatchEvent(new CustomEvent('show-hud', { 
          detail: { label: 'Hand Raised', icon: Hand, active: true } 
        }));
      }
    } catch (error) {
      console.error('Failed to toggle hand:', error);
    }
  }, [call, isHandRaised, playSound]);

  // Keyboard shortcuts for the meeting room
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      switch (e.key.toLowerCase()) {
        case 'm':
          e.preventDefault();
          microphone.toggle().then(() => {
            playSound(isMute ? 'click' : 'pop');
            window.dispatchEvent(new CustomEvent('show-hud', { 
              detail: { 
                label: isMute ? 'Microphone On' : 'Microphone Off', 
                icon: isMute ? Mic : MicOff,
                active: isMute
              } 
            }));
          });
          break;
        case 'v':
          e.preventDefault();
          camera.toggle().then(() => {
            playSound(isCameraMute ? 'click' : 'pop');
            window.dispatchEvent(new CustomEvent('show-hud', { 
              detail: { 
                label: isCameraMute ? 'Camera On' : 'Camera Off', 
                icon: isCameraMute ? Video : VideoOff,
                active: isCameraMute
              } 
            }));
          });
          break;
        case 'h':
          e.preventDefault();
          toggleHand();
          break;
        case 'i':
          e.preventDefault();
          setShowStats(prev => !prev);
          playSound('ping');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [microphone, camera, isMute, isCameraMute, toggleHand, playSound]);

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
      {/* Dynamic Island Morphing Notification */}
      <DynamicIsland />

      {/* Keyboard HUD Confirmation */}
      <KeyboardHUD />

      {/* Connection Stats HUD */}
      <MeetingStatsHUD isOpen={showStats} onClose={() => setShowStats(false)} />

      <div className="relative flex size-full items-center justify-center">
        {/* Audio Visualizer floating in center-top */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <AudioVisualizer />
        </div>

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
        
        {/* Toggle Stats Sidebar */}
        <button 
          onClick={() => {
            setShowStats(!showStats);
            playSound('ping');
          }}
          className={cn(
            'cursor-pointer rounded-swift border p-3 transition-colors',
            showStats 
              ? 'bg-fg-primary text-bg-primary border-fg-primary' 
              : 'bg-accent-muted border-border-subtle hover:bg-accent-hover text-fg-primary'
          )}
          title="System Stats (I)"
        >
          <Activity size={18} />
        </button>
        
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


