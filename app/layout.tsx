import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { startSyncWorker } from "@/lib/workers/syncRepo";
import { startSendDigestWorker } from "@/lib/workers/sendDigest";
import { scheduleDailyDigest } from "@/lib/queue";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OpenContributers",
  description: "Find open source issues to contribute to",
};

// // Single place — server-side only, runs once per process
// if (typeof window === "undefined") {
//   startSyncWorker();
//   startSendDigestWorker();
//   scheduleDailyDigest();
// }

if (typeof window === "undefined" && process.env.NODE_ENV === "development") {
  startSyncWorker();
  startSendDigestWorker();
  scheduleDailyDigest();
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}