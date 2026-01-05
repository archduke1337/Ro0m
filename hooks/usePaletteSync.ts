'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useCallStateHooks } from '@stream-io/video-react-sdk';

export const usePaletteSync = (enabled: boolean) => {
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const extractColor = useCallback(() => {
    // Find the local video element
    const videoElements = document.querySelectorAll('video');
    // In Stream SDK, the local video is usually the one with the local participant ID or similar attribute
    // We'll search for one that is currently playing and likely the local one
    let targetVideo: HTMLVideoElement | null = null;
    
    for (const v of Array.from(videoElements)) {
      if (v.readyState >= 2 && !v.paused && v.videoWidth > 0) {
        // Simple heuristic: most apps have local video as one of the first/last or marked
        // We'll just take the one that looks active
        targetVideo = v;
        break; 
      }
    }

    if (!targetVideo || !enabled) return;

    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Small dimensions for performance
    canvas.width = 10;
    canvas.height = 10;
    
    context.drawImage(targetVideo, 0, 0, 10, 10);
    const imageData = context.getImageData(0, 0, 10, 10).data;

    let r = 0, g = 0, b = 0;
    for (let i = 0; i < imageData.length; i += 4) {
      r += imageData[i];
      g += imageData[i + 1];
      b += imageData[i + 2];
    }

    const count = imageData.length / 4;
    const avgR = Math.round(r / count);
    const avgG = Math.round(g / count);
    const avgB = Math.round(b / count);

    // Boost saturation slightly for a better UI look
    const max = Math.max(avgR, avgG, avgB);
    const min = Math.min(avgR, avgG, avgB);
    const l = (max + min) / 2;
    
    // If it's too dark or too light, default to a neutral theme
    if (l < 20 || l > 240) {
      document.documentElement.style.setProperty('--accent-primary', '255, 255, 255');
      document.documentElement.style.setProperty('--accent-primary-muted', '255, 255, 255, 0.15');
      return;
    }

    document.documentElement.style.setProperty('--accent-primary', `${avgR}, ${avgG}, ${avgB}`);
    document.documentElement.style.setProperty('--accent-primary-muted', `${avgR}, ${avgG}, ${avgB}, 0.15`);
  }, [enabled]);

  useEffect(() => {
    if (enabled) {
      intervalRef.current = setInterval(extractColor, 2000); // Sync every 2 seconds
    } else {
      // Revert to default
      document.documentElement.style.setProperty('--accent-primary', '255, 255, 255');
      document.documentElement.style.setProperty('--accent-primary-muted', '255, 255, 255, 0.15');
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [enabled, extractColor]);
};
