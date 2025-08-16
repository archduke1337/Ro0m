"use client";

import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Loader from "./Loader";
import { useGetCalls } from "@/hooks/useGetCalls";
import MeetingCard from "./MeetingCard";
import { useToast } from "./ui/use-toast";

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

  if (isLoading) return <Loader />;

  const calls: Meeting[] =
    type === "ended" ? (endedCalls ?? []) : type === "upcoming" ? (upcomingCalls ?? []) : recordings ?? [];

  const noCallsMessage =
    type === "ended" ? "No Previous Calls" : type === "upcoming" ? "No Upcoming Calls" : "No Recordings";

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
        <p className="col-span-full text-center text-white">{noCallsMessage}</p>
      )}
    </div>
  );
};

export default CallList;
