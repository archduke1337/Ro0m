'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon, Bell, Mic, Video, Users, AlertCircle, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';

export type IslandType = 'info' | 'success' | 'warning' | 'error' | 'recording';

interface IslandEvent extends CustomEvent {
  detail: {
    label: string;
    icon?: LucideIcon;
    type?: IslandType;
    duration?: number;
  };
}

const DynamicIsland = () => {
  const [active, setActive] = useState(false);
  const [data, setData] = useState<{ label: string; icon?: LucideIcon; type?: IslandType } | null>(null);

  const triggerIsland = useCallback((event: Event) => {
    const customEvent = event as IslandEvent;
    setData(customEvent.detail);
    setActive(true);

    const duration = customEvent.detail.duration || 3000;
    const timer = setTimeout(() => {
      setActive(false);
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.addEventListener('dynamic-island', triggerIsland);
    return () => window.removeEventListener('dynamic-island', triggerIsland);
  }, [triggerIsland]);

  const getIconColor = (type?: IslandType) => {
    switch (type) {
      case 'success': return 'text-system-success';
      case 'warning': return 'text-system-warning';
      case 'error': return 'text-system-error';
      case 'recording': return 'text-red-500 animate-pulse';
      default: return 'text-fg-primary';
    }
  };

  const Icon = data?.icon || Bell;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] pointer-events-none">
      <motion.div
        initial={false}
        animate={{
          width: active ? 320 : 120,
          height: active ? 48 : 36,
          borderRadius: 24,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 30,
        }}
        className="bg-black/90 backdrop-blur-2xl border border-white/10 shadow-swift-2xl flex items-center justify-center overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {!active ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div className="size-2 rounded-full bg-system-success shadow-[0_0_8px_rgba(48,209,88,0.5)]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Ro0m Live</span>
            </motion.div>
          ) : (
            <motion.div
              key="active"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-3 px-4 w-full"
            >
              <div className={cn("p-1.5 rounded-full bg-white/5", getIconColor(data?.type))}>
                <Icon size={16} />
              </div>
              <span className="text-sm font-medium text-white truncate flex-1">
                {data?.label}
              </span>
              {data?.type === 'recording' && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20">
                  <div className="size-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">REC</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default DynamicIsland;
