'use client';

import { useEffect, useRef } from 'react';
import { useCallStateHooks } from '@stream-io/video-react-sdk';

const AudioVisualizer = () => {
  const { useMicrophoneState } = useCallStateHooks();
  const { mediaStream, isMute } = useMicrophoneState();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode>();
  const sourceRef = useRef<MediaStreamAudioSourceNode>();

  useEffect(() => {
    if (!mediaStream || isMute) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      // Draw a flat line if muted
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.stroke();
      }
      return;
    }

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(mediaStream);
    source.connect(analyser);
    analyser.fftSize = 256;
    analyserRef.current = analyser;
    sourceRef.current = source;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    const draw = () => {
      if (!ctx || !canvas) return;
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Average volume for fluid scaling
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const average = sum / bufferLength;
      const noise = average / 128; // 0 to 2 range

      const time = Date.now() / 1000;
      
      // Draw 3 layers of waves for "Siri" effect
      const drawWave = (color: string, speed: number, amplitude: number, offset: number) => {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = color;

        for (let x = 0; x <= canvas.width; x += 1) {
          const relativeX = x / canvas.width;
          // Gaussian envelope to fade edges
          const envelope = Math.exp(-Math.pow(relativeX - 0.5, 2) / 0.05);
          
          const y = canvas.height / 2 + 
            Math.sin(relativeX * 10 + time * speed + offset) * 
            amplitude * noise * envelope;
          
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      };

      drawWave('rgba(147, 197, 253, 0.8)', 5, 20, 0); // blue
      drawWave('rgba(236, 72, 153, 0.6)', 4, 15, 2);  // pink
      drawWave('rgba(167, 139, 250, 0.6)', 6, 18, 4); // purple
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      source.disconnect();
      audioContext.close();
    };
  }, [mediaStream, isMute]);

  return (
    <canvas 
      ref={canvasRef} 
      width={120} 
      height={40} 
      className="opacity-80 transition-opacity duration-500"
    />
  );
};

export default AudioVisualizer;
