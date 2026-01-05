import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-swift bg-accent-muted',
        className
      )}
    />
  );
};

// Skeleton for HomeCard
export const HomeCardSkeleton = () => {
  return (
    <div className="px-6 py-8 flex flex-col justify-between w-full xl:max-w-[270px] min-h-[240px] rounded-swift-lg border border-border-subtle bg-bg-elevated">
      {/* Icon */}
      <Skeleton className="size-12 rounded-swift" />
      
      {/* Text */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
};

// Skeleton for MeetingCard
export const MeetingCardSkeleton = () => {
  return (
    <div className="flex min-h-[240px] w-full flex-col justify-between rounded-swift-lg border border-border-subtle bg-bg-elevated p-6 xl:max-w-[568px]">
      <div className="flex flex-col gap-4">
        {/* Icon */}
        <Skeleton className="size-10 rounded-swift" />
        
        {/* Title and date */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
        {/* Avatars */}
        <div className="flex gap-1">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="size-8 rounded-full" />
        </div>
        
        {/* Buttons */}
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20 rounded-swift" />
          <Skeleton className="h-9 w-16 rounded-swift" />
        </div>
      </div>
    </div>
  );
};

// Skeleton for Hero section
export const HeroSkeleton = () => {
  return (
    <div className="relative overflow-hidden rounded-swift-xl border border-border-subtle bg-bg-elevated">
      <div className="relative flex h-[280px] flex-col justify-between p-8 lg:p-10">
        {/* Badge */}
        <Skeleton className="h-9 w-48 rounded-swift" />
        
        {/* Time display */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-16 w-64 lg:h-20 lg:w-80" />
          <Skeleton className="h-6 w-48" />
        </div>
      </div>
    </div>
  );
};

// Skeleton for Personal Room info
export const PersonalRoomSkeleton = () => {
  return (
    <div className="flex size-full flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-64" />
      </div>
      
      {/* Info Card */}
      <div className="rounded-swift-lg border border-border-subtle bg-bg-elevated p-6 xl:max-w-[600px]">
        {[1, 2, 3].map((i) => (
          <div key={i} className="py-4 border-b border-border-subtle last:border-b-0">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-5 w-full max-w-[300px]" />
          </div>
        ))}
      </div>
      
      {/* Actions */}
      <div className="flex gap-3">
        <Skeleton className="h-10 w-32 rounded-swift" />
        <Skeleton className="h-10 w-36 rounded-swift" />
      </div>
    </div>
  );
};

// Skeleton for CallList
export const CallListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {[1, 2, 3, 4].map((i) => (
        <MeetingCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default Skeleton;
