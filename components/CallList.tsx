"use client";

import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useGetCalls } from "@/hooks/useGetCalls";
import MeetingCard from "./MeetingCard";
import { useToast } from "./ui/use-toast";
import { CallListSkeleton } from "./Skeleton";
import { Calendar, Clock, Video } from "lucide-react";

type Meeting = Call | CallRecording;

const CallList = ({ type }: { type: "ended" | "upcoming" | "recordings" }) => {
  const router = useRouter();
  const { endedCalls, upcomingCalls, callRecordings, isLoading } = useGetCalls();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRecordings = async () => {
      if (!callRecordings?.length) {
        setRecordings([]);
        return;
      }

      try {
        const callData = await Promise.all(
          callRecordings.map((meeting) =>
            meeting.queryRecordings().catch((error) => {
              console.error("Error fetching recording:", error);
              return { recordings: [] } as any;
            }),
          ),
        );

        const newRecordings = callData
          .filter((c) => c.recordings?.length > 0)
          .flatMap((c) => c.recordings);

        setRecordings(newRecordings);
      } catch (error) {
        console.error("Error fetching recordings:", error);
        toast({ title: "Error", description: "Failed to fetch recordings.", variant: "destructive" });
        setRecordings([]);
      }
    };

    if (type === "recordings") fetchRecordings();
  }, [type, callRecordings, toast]);

  if (isLoading) return <CallListSkeleton />;

  const calls: Meeting[] =
    type === "ended" ? (endedCalls ?? []) : type === "upcoming" ? (upcomingCalls ?? []) : recordings ?? [];

  const emptyStateConfig = {
    ended: {
      icon: <Clock className="size-12 text-fg-tertiary" />,
      title: "No Previous Meetings",
      description: "Your past meetings will appear here",
    },
    upcoming: {
      icon: <Calendar className="size-12 text-fg-tertiary" />,
      title: "No Upcoming Meetings",
      description: "Schedule a meeting to get started",
    },
    recordings: {
      icon: <Video className="size-12 text-fg-tertiary" />,
      title: "No Recordings",
      description: "Your meeting recordings will appear here",
    },
  };

  const emptyState = emptyStateConfig[type];

  const openMeeting = (callId: string) => router.push(`/meeting/${callId}`);

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0 ? (
        calls.map((meeting) => {
          const isRecording = type === "recordings";

          const title =
            (isRecording ? (meeting as CallRecording).filename : (meeting as Call).state?.custom?.description) ||
            "No Description";

          const date =
            (isRecording ? (meeting as CallRecording).start_time : (meeting as Call).state?.startsAt)?.toLocaleString?.() ||
            "No date";

          const link = isRecording ? (meeting as CallRecording).url : `/meeting/${(meeting as Call).id}`;

          return (
            <MeetingCard
              key={isRecording ? (meeting as CallRecording).url : (meeting as Call).id}
              icon={
                type === "ended" ? "/icons/previous.svg" : type === "upcoming" ? "/icons/upcoming.svg" : "/icons/recordings.svg"
              }
              title={title}
              date={date}
              isPreviousMeeting={type === "ended"}
              link={link}
              buttonIcon1={isRecording ? "/icons/play.svg" : undefined}
              buttonText={isRecording ? "Play" : "Start"}
              handleClick={() => {
                if (isRecording) {
                  const url = (meeting as CallRecording).url;
                  if (url) router.push(url);
                  else toast({ title: "Error", description: "Recording URL not found", variant: "destructive" });
                } else {
                  openMeeting((meeting as Call).id);
                }
              }}
            />
          );
        })
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
          <div className="flex-center size-20 rounded-swift-lg bg-accent-muted border border-border-subtle mb-4">
            {emptyState.icon}
          </div>
          <h3 className="text-lg font-semibold text-fg-primary mb-1">{emptyState.title}</h3>
          <p className="text-sm text-fg-secondary">{emptyState.description}</p>
        </div>
      )}
    </div>
  );
};

export default CallList;

