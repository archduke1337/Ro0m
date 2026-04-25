'use client';
import { useCallback, useEffect, useState } from 'react';
import {
  DeviceSettings,
  VideoPreview,
  useCall,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';

import Alert from './Alert';
import { Button } from './ui/button';

const getReadableDeviceError = (error: unknown) => {
  if (!(error instanceof Error)) {
    return 'Unable to access camera and microphone. Please try again.';
  }

  if (
    error.message.includes('Permission denied') ||
    error.message.includes('NotAllowedError')
  ) {
    return 'Camera or microphone permission is blocked. Allow access in your browser settings.';
  }

  if (error.message.includes('NotFoundError')) {
    return 'No usable camera or microphone was found on this device.';
  }

  if (
    error.message.includes('send-audio') ||
    error.message.includes('send-video')
  ) {
    return 'Your user role is missing media publishing permissions (send-audio/send-video).';
  }

  return error.message;
};

const isCallNotFoundError = (error: unknown) => {
  if (!(error instanceof Error)) return false;

  return error.message.includes("Can't find call with id");
};

const MeetingSetup = ({
  setIsSetupComplete,
  allowCreateOnJoin,
}: {
  setIsSetupComplete: (value: boolean) => void;
  allowCreateOnJoin?: boolean;
}) => {
  // https://getstream.io/video/docs/react/guides/call-and-participant-state/#call-state
  const { useCallEndedAt, useCallStartsAt } = useCallStateHooks();
  const callStartsAt = useCallStartsAt();
  const callEndedAt = useCallEndedAt();
  const callTimeNotArrived =
    callStartsAt && new Date(callStartsAt) > new Date();
  const callHasEnded = !!callEndedAt;

  const call = useCall();

  if (!call) {
    throw new Error(
      'useStreamCall must be used within a StreamCall component.',
    );
  }

  // https://getstream.io/video/docs/react/ui-cookbook/replacing-call-controls/
  const [isMicCamToggled, setIsMicCamToggled] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [deviceError, setDeviceError] = useState<string | null>(null);

  const applyDevicePreference = useCallback(
    async (disableDevices: boolean) => {
      if (disableDevices) {
        await call.camera.disable();
        await call.microphone.disable();
        return;
      }

      await call.camera.enable();
      await call.microphone.enable();
    },
    [call],
  );

  const requestDevicePermission = async () => {
    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    stream.getTracks().forEach((track) => track.stop());
  };

  useEffect(() => {
    let isCancelled = false;

    const syncDevicePreference = async () => {
      try {
        setDeviceError(null);
        await applyDevicePreference(isMicCamToggled);
      } catch (error) {
        if (isCancelled) return;

        console.error('Failed to set device preference:', error);
        setDeviceError(getReadableDeviceError(error));
      }
    };

    syncDevicePreference();

    return () => {
      isCancelled = true;
    };
  }, [isMicCamToggled, applyDevicePreference]);

  if (callTimeNotArrived)
    return (
      <Alert
        title={`Your meeting has not started yet. It is scheduled for ${callStartsAt.toLocaleString()}`}
      />
    );

  if (callHasEnded)
    return (
      <Alert
        title="The call has been ended by the host"
        iconUrl="/icons/call-ended.svg"
      />
    );

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-6 bg-bg-primary text-fg-primary">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Setup</h1>
        <p className="text-sm text-fg-secondary">Configure your camera and microphone</p>
      </div>
      
      <div className="rounded-swift-xl border border-border-subtle overflow-hidden bg-bg-elevated">
        <VideoPreview />
      </div>
      
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={isMicCamToggled}
              onChange={(e) => setIsMicCamToggled(e.target.checked)}
              className="peer sr-only"
            />
            <div className="size-5 rounded-[6px] border-2 border-border bg-bg-tertiary peer-checked:bg-fg-primary peer-checked:border-fg-primary transition-all" />
            <div className="absolute inset-0 flex items-center justify-center text-bg-primary opacity-0 peer-checked:opacity-100 transition-opacity">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <span className="text-sm text-fg-secondary group-hover:text-fg-primary transition-colors">
            Join with mic and camera off
          </span>
        </label>
        <DeviceSettings />
      </div>

      {deviceError && (
        <p className="max-w-md text-center text-sm text-system-error">{deviceError}</p>
      )}
      
      <Button
        className="rounded-swift bg-fg-primary px-8 py-3 text-sm font-medium text-bg-primary hover:opacity-90 transition-opacity"
        disabled={isJoining}
        onClick={async () => {
          if (isJoining) return;

          setIsJoining(true);
          setJoinError(null);

          try {
            if (!isMicCamToggled) {
              await requestDevicePermission();
            }

            await call.join();

            try {
              await applyDevicePreference(isMicCamToggled);
            } catch (error) {
              console.error('Failed to publish local media after join:', error);

              await call.leave().catch((leaveError) => {
                console.error('Failed to leave call after media publish error:', leaveError);
              });

              throw new Error(getReadableDeviceError(error));
            }

            setIsSetupComplete(true);
          } catch (error) {
            console.error('Failed to join meeting:', error);

            if (allowCreateOnJoin && isCallNotFoundError(error)) {
              try {
                await call.getOrCreate({
                  data: {
                    starts_at: new Date().toISOString(),
                  },
                });

                await call.join();

                await applyDevicePreference(isMicCamToggled);

                setIsSetupComplete(true);
                return;
              } catch (createError) {
                console.error('Failed to auto-create personal room:', createError);
              }
            }

            if (isCallNotFoundError(error)) {
              setJoinError('This meeting does not exist yet. Ask the host to start it first.');
              return;
            }

            const message =
              error instanceof Error && error.message
                ? error.message
                : 'Unable to join meeting. Please try again.';

            setJoinError(message);
          } finally {
            setIsJoining(false);
          }
        }}
      >
        {isJoining ? 'Joining…' : 'Join Meeting'}
      </Button>

      {joinError && (
        <p className="text-sm text-system-error">{joinError}</p>
      )}
    </div>
  );
};

export default MeetingSetup;
