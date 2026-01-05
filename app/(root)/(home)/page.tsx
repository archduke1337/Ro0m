"use client";

import { useEffect, useState } from "react";
import MeetingTypeList from '@/components/MeetingTypeList';
import { useGetCalls } from '@/hooks/useGetCalls';

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
    <section className="flex size-full flex-col gap-5 text-white">
      <div className="h-[303px] w-full rounded-[20px] bg-hero bg-cover">
        <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
          <h2 className="glassmorphism max-w-[273px] rounded py-2 text-center text-base font-normal">
            {upcomingMeetingTime 
              ? `Upcoming Meeting at: ${upcomingMeetingTime}`
              : 'No Upcoming Meetings'}
          </h2>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold lg:text-7xl">{time}</h1>
            <p className="text-lg font-medium text-sky-1 lg:text-2xl">{date}</p>
          </div>
        </div>
      </div>

      <MeetingTypeList />
    </section>
  );
};

export default Home;
