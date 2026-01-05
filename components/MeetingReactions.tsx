'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Reaction {
  id: string;
  emoji: string;
  x: number;
}

const REACTIONS = [
  { emoji: '👍', label: 'Thumbs Up' },
  { emoji: '❤️', label: 'Heart' },
  { emoji: '👏', label: 'Clap' },
  { emoji: '😂', label: 'Laugh' },
  { emoji: '🎉', label: 'Celebrate' },
  { emoji: '🔥', label: 'Fire' },
];

const MeetingReactions = () => {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addReaction = useCallback((emoji: string) => {
    const id = crypto.randomUUID();
    const x = Math.random() * 60 - 30; // Random horizontal offset
    
    setReactions((prev) => [...prev, { id, emoji, x }]);
    
    // Remove reaction after animation completes
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== id));
    }, 3000);
  }, []);

  return (
    <div className="relative">
      {/* Floating Reactions Display */}
      <div className="fixed bottom-32 left-1/2 -translate-x-1/2 pointer-events-none z-50">
        <AnimatePresence>
          {reactions.map((reaction) => (
            <motion.div
              key={reaction.id}
              initial={{ opacity: 0, y: 0, scale: 0.5, x: reaction.x }}
              animate={{ 
                opacity: [0, 1, 1, 0], 
                y: -200, 
                scale: [0.5, 1.2, 1, 0.8],
                x: reaction.x 
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 3,
                ease: 'easeOut',
                times: [0, 0.1, 0.8, 1]
              }}
              className="absolute text-5xl"
              style={{ bottom: 0 }}
            >
              {reaction.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Reaction Picker */}
      <div className="relative">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2"
            >
              <div className="flex items-center gap-1 p-2 rounded-swift-lg bg-bg-elevated border border-border-subtle shadow-swift-lg">
                {REACTIONS.map(({ emoji, label }) => (
                  <motion.button
                    key={emoji}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      addReaction(emoji);
                      setIsOpen(false);
                    }}
                    className="size-10 flex items-center justify-center rounded-swift text-2xl hover:bg-accent-muted transition-colors"
                    title={label}
                    aria-label={`React with ${label}`}
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
              {/* Arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                <div className="w-3 h-3 bg-bg-elevated border-r border-b border-border-subtle rotate-45" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'size-11 flex items-center justify-center rounded-swift transition-colors',
            'bg-accent-muted border border-border-subtle',
            isOpen ? 'bg-fg-primary text-bg-primary' : 'hover:bg-accent-hover'
          )}
          aria-label="Open reactions"
          aria-expanded={isOpen}
        >
          <span className="text-xl">😊</span>
        </motion.button>
      </div>
    </div>
  );
};

export default MeetingReactions;
