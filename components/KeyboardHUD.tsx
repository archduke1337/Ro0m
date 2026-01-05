'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface HUDEvent extends CustomEvent {
  detail: {
    label: string;
    icon: LucideIcon;
    active?: boolean;
  };
}

const KeyboardHUD = () => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState<{ label: string; icon: LucideIcon; active?: boolean } | null>(null);

  const showHUD = useCallback((event: Event) => {
    const customEvent = event as HUDEvent;
    setData(customEvent.detail);
    setVisible(true);

    // Auto-hide after 1.5 seconds
    const timer = setTimeout(() => {
      setVisible(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.addEventListener('show-hud', showHUD);
    return () => window.removeEventListener('show-hud', showHUD);
  }, [showHUD]);

  return (
    <AnimatePresence>
      {visible && data && (
        <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ 
              type: 'spring', 
              stiffness: 400, 
              damping: 30 
            }}
            className="flex flex-col items-center gap-4 px-10 py-8 rounded-swift-2xl bg-bg-elevated/80 backdrop-blur-2xl border border-border-subtle shadow-swift-2xl"
          >
            <div className="p-4 rounded-swift-xl bg-bg-primary/50 border border-border-subtle">
              <data.icon 
                className={data.active === false ? "text-system-error" : "text-fg-primary"} 
                size={48} 
              />
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-xl font-semibold tracking-tight text-fg-primary">
                {data.label}
              </span>
              <span className="text-sm font-medium text-fg-tertiary uppercase tracking-widest">
                Shortcut Applied
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default KeyboardHUD;
