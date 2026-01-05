"use client";

import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { useGetCallById } from "@/hooks/useGetCallById";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { getMeetingLink } from "@/lib/meeting-utils";

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  return (
    <div className="flex flex-col gap-1.5 py-4 border-b border-border-subtle last:border-b-0">
      <span className="text-sm text-fg-tertiary uppercase tracking-wide">
        {label}
      </span>
      <span className="text-base font-medium text-fg-primary truncate">
        {value}
      </span>
    </div>
  );
};

const PersonalRoom = () => {
  const router = useRouter();
  const { user } = useUser();
  const client = useStreamVideoClient();
  const { toast } = useToast();
  
  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied",
        description: "Meeting invitation copied to clipboard",
      });
    }).catch((err) => {
      console.error("Copy failed:", err);
      toast({
        title: "Error",
        description: "Failed to copy invitation",
        variant: "destructive",
      });
    });
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
  
  const meetingLink = meetingId ? `${getMeetingLink(meetingId)}?personal=true` : '';

  return (
    <section className="flex size-full flex-col gap-8 text-fg-primary">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">Personal Room</h1>
        <p className="text-fg-secondary text-sm">Your permanent meeting space</p>
      </div>
      
      {/* Info Card */}
      <div className="rounded-swift-lg border border-border-subtle bg-bg-elevated p-6 xl:max-w-[600px]">
        <InfoRow label="Topic" value={`${user?.username || 'Your'}'s Meeting Room`} />
        <InfoRow label="Meeting ID" value={meetingId || ''} />
        <InfoRow label="Invite Link" value={meetingLink} />
      </div>
      
      {/* Actions */}
      <div className="flex gap-3">
        <Button 
          className="rounded-swift bg-fg-primary px-6 py-2.5 text-sm font-medium text-bg-primary hover:opacity-90 transition-opacity" 
          onClick={startRoom}
        >
          Start Meeting
        </Button>
        <Button
          className="rounded-swift bg-accent-muted border border-border-subtle px-6 py-2.5 text-sm font-medium text-fg-primary hover:bg-accent-hover transition-colors flex items-center gap-2"
          onClick={() => {
            const inviteText = `Join my meeting room!\n\nTopic: ${user?.username}'s Meeting Room\nMeeting ID: ${meetingId}\nJoin Link: ${meetingLink}`;
            copyToClipboard(inviteText);
          }}
        >
          <Image
            src="/icons/copy.svg"
            alt=""
            width={16}
            height={16}
            className="opacity-70"
          />
          Copy Invitation
        </Button>
      </div>
    </section>
  );
};

export default PersonalRoom;
