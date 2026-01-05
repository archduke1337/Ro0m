'use client';

import { useCallStateHooks } from '@stream-io/video-react-sdk';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, Shield, BarChart3, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MeetingStatsHUDProps {
  isOpen: boolean;
  onClose: () => void;
}

const MeetingStatsHUD = ({ isOpen, onClose }: MeetingStatsHUDProps) => {
  const { useCallStatsReport } = useCallStateHooks();
  const statsReport = useCallStatsReport();

  // Extract relevant stats from the report
  const latency = statsReport?.publisherStats?.averageRoundTripTimeInMs || 0;
  const width = statsReport?.publisherStats?.highestFrameWidth || 0;
  const height = statsReport?.publisherStats?.highestFrameHeight || 0;
  const resolution = width > 0 ? `${width}x${height}` : 'N/A';
  const fps = statsReport?.publisherStats?.highestFramesPerSecond || 0;
  const bitrate = (statsReport?.publisherStats?.totalBytesSent || 0) / 1024; // Simple kb estimate
  const jitter = statsReport?.publisherStats?.averageJitterInMs || 0;

  const StatItem = ({ label, value, icon: Icon, unit = '' }: any) => (
    <div className="flex items-center justify-between py-2 border-b border-white/[0.05] last:border-0">
      <div className="flex items-center gap-3">
        <div className="p-1.5 rounded-swift bg-white/[0.05]">
          <Icon size={14} className="text-fg-tertiary" />
        </div>
        <span className="text-sm font-medium text-fg-secondary">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-sm font-mono font-bold text-fg-primary">{value}</span>
        {unit && <span className="text-[10px] font-medium text-fg-tertiary uppercase">{unit}</span>}
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="fixed top-24 right-6 z-40 w-[280px] rounded-swift-xl bg-bg-elevated/90 backdrop-blur-xl border border-border-subtle shadow-swift-xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-white/[0.03] border-b border-border-subtle">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-fg-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-fg-primary">System Status</span>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-swift hover:bg-white/[0.1] text-fg-tertiary transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-1">
            <StatItem 
              label="Latency" 
              value={latency} 
              icon={Zap} 
              unit="ms" 
            />
            <StatItem 
              label="Bitrate" 
              value={bitrate.toFixed(1)} 
              icon={BarChart3} 
              unit="kb" 
            />
            <StatItem 
              label="Resolution" 
              value={resolution} 
              icon={Activity} 
            />
            <StatItem 
              label="FPS" 
              value={fps} 
              icon={Activity} 
            />
            <StatItem 
              label="Jitter" 
              value={jitter.toFixed(1)} 
              icon={Activity} 
              unit="ms" 
            />
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-white/[0.02] border-t border-border-subtle">
            <div className="flex items-center gap-2">
              <div className={cn(
                "size-2 rounded-full",
                latency < 100 ? "bg-system-success" : latency < 300 ? "bg-system-warning" : "bg-system-error"
              )} />
              <span className="text-[10px] font-medium text-fg-tertiary uppercase tracking-wider">
                Connection: {latency < 100 ? 'Stable' : latency < 300 ? 'Fair' : 'Poor'}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MeetingStatsHUD;
