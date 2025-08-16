"use client";

import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { useGetCallById } from "@/hooks/useGetCallById";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Table = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col items-start gap-2 xl:flex-row">
      <h1 className="text-base font-medium text-sky-1 lg:text-xl xl:min-w-32">
        {title}:
      </h1>
      <h1 className="truncate text-sm font-bold max-sm:max-w-[320px] lg:text-xl">
        {description}
      </h1>
    </div>
  );
};

const PersonalRoom = () => {
  const router = useRouter();
  const { user } = useUser();
  const client = useStreamVideoClient();
  const { toast } = useToast();
  
  const copyToClipboard = async (text: string) => {
    if (!text) {
      toast({
        title: "Error",
        description: "No content to copy",
        variant: "destructive",
      });
      return;
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        // For HTTPS or localhost
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for HTTP
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand("copy");
          textArea.remove();
        } catch (error) {
          console.error("Fallback copy failed:", error);
          textArea.remove();
          throw error;
        }
      }
      
      toast({
        title: "Success",
        description: "Meeting invitation copied to clipboard!",
      });
    } catch (err) {
      console.error("Copy failed:", err);
      toast({
        title: "Error",
        description: "Failed to copy invitation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const meetingId = user?.id;

  const { call } = useGetCallById(meetingId!);

  const startRoom = async () => {
    if (!client || !user) return;

    const newCall = client.call("default", meetingId!);

    if (!call) {
      await newCall.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
        },
      });
    }

    router.push(`/meeting/${meetingId}?personal=true`);
  };

  const getMeetingLink = () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    // In production, use the configured URL
    if (baseUrl && !baseUrl.includes('localhost')) {
      return `${baseUrl}/meeting/${meetingId}?personal=true`;
    }
    // In development or if BASE_URL is not set, use the current origin
    return typeof window !== 'undefined' 
      ? `${window.location.origin}/meeting/${meetingId}?personal=true`
      : `/meeting/${meetingId}?personal=true`;
  };
  
  const meetingLink = getMeetingLink();

  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-xl font-bold lg:text-3xl">Personal Meeting Room</h1>
      <div className="flex w-full flex-col gap-8 xl:max-w-[900px]">
        <Table title="Topic" description={`${user?.username}'s Meeting Room`} />
        <Table title="Meeting ID" description={meetingId!} />
        <Table title="Invite Link" description={meetingLink} />
      </div>
      <div className="flex gap-5">
        <Button className="bg-blue-1" onClick={startRoom}>
          Start Meeting
        </Button>
        <Button
          className="flex items-center gap-2 bg-dark-3"
          onClick={() => {
            const inviteText = `Join my meeting room!\n\nTopic: ${user?.username}'s Meeting Room\nMeeting ID: ${meetingId}\nJoin Link: ${meetingLink}`;
            copyToClipboard(inviteText);
          }}
        >
          <Image
            src="/icons/copy.svg"
            alt="copy"
            width={20}
            height={20}
            className="object-contain"
          />
          Copy Invitation
        </Button>
      </div>
    </section>
  );
};

export default PersonalRoom;
