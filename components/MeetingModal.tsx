"use client";
import { ReactNode } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import Image from "next/image";

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  className?: string;
  children?: ReactNode;
  handleClick?: () => void;
  buttonText?: string;
  image?: string;
  buttonIcon?: string;
}

const MeetingModal = ({
  isOpen,
  onClose,
  title,
  className,
  children,
  handleClick,
  buttonText,
  image,
  buttonIcon,
}: MeetingModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex w-full max-w-[480px] flex-col gap-6 border border-border-subtle bg-bg-elevated px-8 py-10 text-fg-primary rounded-swift-xl">
        <div className="flex flex-col gap-6">
          {image && (
            <div className="flex justify-center">
              <div className="flex-center size-16 rounded-swift-lg bg-accent-muted border border-border-subtle">
                <Image src={image} alt="" width={32} height={32} className="opacity-80" />
              </div>
            </div>
          )}
          <h1 className={cn("text-xl font-semibold tracking-tight text-center", className)}>
            {title}
          </h1>
          {children}
          <Button
            className="w-full rounded-swift bg-fg-primary py-3 text-sm font-medium text-bg-primary hover:opacity-90 transition-opacity"
            onClick={handleClick}
          >
            {buttonIcon && (
              <Image
                src={buttonIcon}
                alt=""
                width={16}
                height={16}
                className="brightness-0"
              />
            )}
            {buttonIcon && <span className="ml-2">{buttonText || "Schedule Meeting"}</span>}
            {!buttonIcon && (buttonText || "Schedule Meeting")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingModal;
