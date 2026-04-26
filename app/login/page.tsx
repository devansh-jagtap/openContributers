"use client"

import { signIn } from "next-auth/react"
import Link from "next/link"
import { ThemeToggle } from "@/components/ThemeToggle"

export default function LoginPage() {
  return (
    <main className="landing-shell min-h-screen flex items-center justify-center px-6">
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      <div className="landing-ambient" aria-hidden="true">
        <span className="landing-orb landing-orb-one" />
        <span className="landing-orb landing-orb-two" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-fade-up">
        <div className="rounded-3xl border border-zinc-200/80 bg-white/90 dark:border-zinc-800/80 dark:bg-zinc-900/90 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur sm:p-10">

          <div className="flex flex-col items-center gap-2 text-center">
            <Link href="/" className="text-base font-semibold tracking-tight text-zinc-900">
              OpenContributers
            </Link>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
              Start contributing today
            </h1>
            <p className="text-sm leading-relaxed text-zinc-500">
              Get open source issues delivered to your inbox daily.
              Build the habit of contributing — one issue at a time.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <button
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-zinc-900 px-6 py-3.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 active:translate-y-0"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white dark:fill-zinc-900">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              Continue with GitHub
            </button>
          </div>

          <div className="mt-6 space-y-2">
            {[
              "Read access to public repos and issues only",
              "No spam — one digest email per day maximum",
              "Unsubscribe from any repo anytime",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                <svg className="h-3.5 w-3.5 shrink-0 text-zinc-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {item}
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-zinc-400">
            By signing in you agree to our terms of use.{" "}
            <Link href="/" className="underline underline-offset-2 hover:text-zinc-600 dark:hover:text-zinc-300">
              Back to home
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}