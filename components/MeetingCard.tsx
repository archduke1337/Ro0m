"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

interface MeetingCardProps {
  title: string;
  date: string;
  icon: string;
  isPreviousMeeting?: boolean;
  buttonIcon1?: string;
  buttonText?: string;
  handleClick: () => void;
  link: string;
}

const MeetingCard = ({
  icon,
  title,
  date,
  isPreviousMeeting,
  buttonIcon1,
  handleClick,
  link,
  buttonText,
}: MeetingCardProps) => {
  const { toast } = useToast();

  return (
    <article className="group flex min-h-[240px] w-full flex-col justify-between rounded-swift-lg border border-border-subtle bg-bg-elevated p-6 transition-all duration-200 hover:border-border hover:bg-bg-tertiary xl:max-w-[568px]">
      <div className="flex flex-col gap-4">
        <div className="flex size-10 items-center justify-center rounded-swift bg-accent-muted border border-border-subtle">
          <Image src={icon} alt="" width={20} height={20} className="opacity-70" />
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-lg font-semibold text-fg-primary tracking-tight">{title}</h2>
            <p className="text-sm text-fg-secondary">{date}</p>
          </div>
        </div>
      </div>
      
      <div className={cn("flex items-center justify-between pt-4 border-t border-border-subtle", {})}>
        <div className="w-full text-sm text-fg-tertiary">Meeting details</div>
        
        {!isPreviousMeeting && (
          <div className="flex gap-2">
            <Button 
              onClick={handleClick} 
              className="rounded-swift bg-fg-primary px-4 py-2 text-sm font-medium text-bg-primary hover:opacity-90 transition-opacity"
            >
              {buttonIcon1 && (
                <Image src={buttonIcon1} alt="" width={16} height={16} className="brightness-0" />
              )}
              {buttonIcon1 && <span className="ml-1.5">{buttonText}</span>}
              {!buttonIcon1 && buttonText}
            </Button>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(link);
                toast({ title: "Link Copied" });
              }}
              className="rounded-swift bg-accent-muted border border-border-subtle px-4 py-2 text-sm font-medium text-fg-primary hover:bg-accent-hover transition-colors"
            >
              <Image
                src="/icons/copy.svg"
                alt=""
                width={16}
                height={16}
                className="opacity-70"
              />
              <span className="ml-1.5">Copy</span>
            </Button>
          </div>
        )}
      </div>
    </article>
  );
};

export default MeetingCard;
