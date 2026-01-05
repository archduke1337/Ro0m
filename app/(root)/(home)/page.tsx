"use client";

import { useEffect, useState } from "react";
import MeetingTypeList from '@/components/MeetingTypeList';
import { useGetCalls } from '@/hooks/useGetCalls';
import { FadeIn, SlideIn } from '@/components/PageTransition';

const Home = () => {
  const [now, setNow] = useState<Date>(() => new Date());
  const { upcomingCalls } = useGetCalls();

  useEffect(() => {
    // update every second to keep minutes accurate and avoid drift
    const tick = () => setNow(new Date());
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  const date = new Intl.DateTimeFormat(undefined, { dateStyle: 'full' }).format(now);

  // Get the next upcoming meeting time
  const nextMeeting = upcomingCalls && upcomingCalls.length > 0 
    ? upcomingCalls[0]?.state?.startsAt 
    : null;
  
  const upcomingMeetingTime = nextMeeting 
    ? new Date(nextMeeting).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <section className="flex size-full flex-col gap-8 text-fg-primary">
      {/* Hero Section - SwiftUI inspired */}
      <FadeIn duration={0.5}>
        <div className="relative overflow-hidden rounded-swift-xl border border-border-subtle bg-bg-elevated">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.01]" />
          
          <div className="relative flex h-[280px] flex-col justify-between p-8 lg:p-10">
            {/* Upcoming meeting badge */}
            {upcomingMeetingTime && (
              <SlideIn direction="down" delay={0.2}>
                <div className="glass-subtle w-fit rounded-swift px-4 py-2">
                  <span className="text-sm font-medium text-fg-secondary">
                    Next meeting at <span className="text-fg-primary">{upcomingMeetingTime}</span>
                  </span>
                </div>
              </SlideIn>
            )}
            {!upcomingMeetingTime && (
              <SlideIn direction="down" delay={0.2}>
                <div className="glass-subtle w-fit rounded-swift px-4 py-2">
                  <span className="text-sm font-medium text-fg-tertiary">
                    No upcoming meetings
                  </span>
                </div>
              </SlideIn>
            )}
            
            {/* Time display */}
            <div className="flex flex-col gap-1">
              <SlideIn direction="up" delay={0.1}>
                <h1 className="text-display text-fg-primary tracking-tighter lg:text-[5rem]">
                  {time}
                </h1>
              </SlideIn>
              <SlideIn direction="up" delay={0.2}>
                <p className="text-lg font-medium text-fg-secondary lg:text-xl">
                  {date}
                </p>
              </SlideIn>
            </div>
          </div>
        </div>
      </FadeIn>

      <SlideIn direction="up" delay={0.3}>
        <MeetingTypeList />
      </SlideIn>
    </section>
  );
};

export default Home;

