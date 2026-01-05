'use client';

import Image from 'next/image';

import { cn } from '@/lib/utils';

interface HomeCardProps {
  className?: string;
  img: string;
  title: string;
  description: string;
  handleClick?: () => void;
}

const HomeCard = ({ className, img, title, description, handleClick }: HomeCardProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick?.();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={cn(
        'group relative overflow-hidden',
        'px-6 py-8 flex flex-col justify-between w-full xl:max-w-[270px] min-h-[240px]',
        'rounded-swift-lg border border-border-subtle bg-bg-elevated',
        'cursor-pointer transition-all duration-300 ease-out',
        'hover:border-border hover:bg-bg-tertiary hover:shadow-swift',
        'focus:outline-none focus:ring-2 focus:ring-fg-primary/20 focus:ring-offset-2 focus:ring-offset-bg-primary',
        'active:scale-[0.98]',
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`${title}: ${description}`}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative flex-center size-12 rounded-swift bg-accent-muted border border-border-subtle group-hover:border-border transition-colors">
        <Image src={img} alt="" width={24} height={24} aria-hidden="true" className="opacity-80" />
      </div>
      
      <div className="relative flex flex-col gap-1.5">
        <h2 className="text-lg font-semibold text-fg-primary tracking-tight">{title}</h2>
        <p className="text-sm text-fg-secondary">{description}</p>
      </div>
    </div>
  );
};

export default HomeCard;
