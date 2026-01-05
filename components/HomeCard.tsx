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
        'bg-orange-1 px-4 py-6 flex flex-col justify-between w-full xl:max-w-[270px] min-h-[260px] rounded-[14px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-1 focus:ring-offset-2 focus:ring-offset-dark-2',
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`${title}: ${description}`}
    >
      <div className="flex-center glassmorphism size-12 rounded-[10px]">
        <Image src={img} alt="" width={27} height={27} aria-hidden="true" />
      </div>
      
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-lg font-normal">{description}</p>
      </div>
    </div>
  );
};

export default HomeCard;
