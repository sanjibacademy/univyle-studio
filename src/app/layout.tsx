import type { Metadata } from "next";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "UNIVYLE Studio | Premium AI Prompts & Freelance Digital Solutions",
  description:
    "Premium AI Prompt Sharing platform, freelance portfolio for graphics, video editing, and web development, blog updates, and course callback bookings.",
  keywords: "AI prompts, ChatGPT, Midjourney, graphics design, video editing, web development, freelance",
  openGraph: {
    title: "UNIVYLE Studio",
    description: "Your hub for ChatGPT / Midjourney prompts, Graphics, Video Editing, and Full-Stack Web Development.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-zinc-950 text-zinc-100 min-h-screen">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
