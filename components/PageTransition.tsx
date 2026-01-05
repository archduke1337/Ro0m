'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ 
          duration: 0.3,
          ease: 'easeOut'
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Stagger children animation for lists
export const StaggerContainer = ({ 
  children,
  className,
  delay = 0
}: { 
  children: ReactNode;
  className?: string;
  delay?: number;
}) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      className={className}
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: 0.05,
            delayChildren: delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

// Individual stagger item
export const StaggerItem = ({ 
  children,
  className 
}: { 
  children: ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      className={className}
      variants={{
        initial: { opacity: 0, y: 20 },
        animate: { 
          opacity: 1, 
          y: 0,
          transition: {
            type: 'spring',
            stiffness: 300,
            damping: 24,
          }
        },
      }}
    >
      {children}
    </motion.div>
  );
};

// Fade in animation
export const FadeIn = ({ 
  children,
  className,
  delay = 0,
  duration = 0.4 
}: { 
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ 
        delay, 
        duration,
        ease: 'easeOut'
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Scale in animation (for modals, cards)
export const ScaleIn = ({ 
  children,
  className 
}: { 
  children: ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ 
        type: 'spring',
        stiffness: 300,
        damping: 25,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Slide in from direction
export const SlideIn = ({ 
  children,
  className,
  direction = 'up',
  delay = 0
}: { 
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
}) => {
  const directionMap = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directionMap[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ 
        delay,
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
