'use client';

import { useCallback, useRef } from 'react';

type SoundType = 'pop' | 'ping' | 'click' | 'join' | 'leave' | 'hand';

const SOUND_URLS: Record<SoundType, string> = {
  pop: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Subtle pop for reactions
  ping: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // Subtle ping for command palette
  click: 'https://assets.mixkit.co/active_storage/sfx/2569/2569-preview.mp3', // Subtle click
  join: 'https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3', // Soft join sound
  leave: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3', // Soft leave sound
  hand: 'https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3', // Hand raise sound
};

export const useSounds = () => {
  const audioRefs = useRef<Partial<Record<SoundType, HTMLAudioElement>>>({});

  const playSound = useCallback((type: SoundType) => {
    // Only play on client side
    if (typeof window === 'undefined') return;

    try {
      if (!audioRefs.current[type]) {
        audioRefs.current[type] = new Audio(SOUND_URLS[type]);
        audioRefs.current[type]!.volume = 0.2; // Keep it subtle
      }

      const audio = audioRefs.current[type];
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch((err) => {
          // Ignore autoplay blocks
          console.debug('Autoplay prevented or audio error:', err);
        });
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }, []);

  return { playSound };
};
