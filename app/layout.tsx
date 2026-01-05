import { ReactNode } from "react";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "react-datepicker/dist/react-datepicker.css";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Ro0m",
  description: "Video calling App",
  icons: {
    icon: "/icons/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <ClerkProvider
        appearance={{
          layout: {
            socialButtonsVariant: "iconButton",
            logoImageUrl: "/icons/logo.svg",
          },
          variables: {
            colorText: "#FFFFFF",
            colorPrimary: "#FFFFFF",
            colorBackground: "#0A0A0A",
            colorInputBackground: "#1C1C1E",
            colorInputText: "#FFFFFF",
            borderRadius: "12px",
          },
          elements: {
            card: "bg-bg-secondary border border-border-subtle",
            headerTitle: "text-fg-primary",
            headerSubtitle: "text-fg-secondary",
            socialButtonsIconButton: "border-border hover:bg-accent-muted",
            formButtonPrimary: "bg-fg-primary text-bg-primary hover:opacity-90",
            footerActionLink: "text-fg-secondary hover:text-fg-primary",
          },
        }}
      >
        <body className={`${inter.className} bg-bg-primary text-fg-primary antialiased`}>
          <Toaster />
          {children}
        </body>
      </ClerkProvider>
    </html>
  );
}

