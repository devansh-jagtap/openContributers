import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import RepoSearch from "@/components/RepoSearch"
import MySubscriptions from "@/components/MySubscriptions"
import SignOutButton from "@/components/SignOutButton"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  return (
    <main className="landing-shell min-h-screen px-6 py-8 sm:px-10">
      <div className="landing-ambient" aria-hidden="true">
        <span className="landing-orb landing-orb-one" />
        <span className="landing-orb landing-orb-two" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6">

        {/* NAVBAR */}
        <header className="animate-fade-up rounded-2xl border border-zinc-200/80 bg-white/90 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.07)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt="avatar"
                  className="h-10 w-10 rounded-full border border-zinc-200 object-cover"
                />
              )}
              <div>
                <Link href="/" className="text-xs text-zinc-400 hover:text-zinc-600 transition">
                  OpenContributers
                </Link>
                <p className="text-base font-semibold text-zinc-900">
                  Welcome, {session.user?.name?.split(" ")[0] ?? "Contributor"}
                </p>
                <p className="text-xs text-zinc-500">{session.user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="rounded-lg border border-zinc-200 px-4 py-2 text-sm text-zinc-700 transition hover:bg-zinc-100"
              >
                Home
              </Link>
              <SignOutButton />
            </div>
          </div>
        </header>

        {/* 3 COLUMN LAYOUT */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* COL 1 — Direction Guide */}
          <div className="animate-fade-up scroll-mt-6 lg:h-[640px]" style={{ animationDelay: "80ms" }}>
            <div className="rounded-2xl border border-zinc-200/80 bg-white/90 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] h-full">
              <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">Direction Guide</p>
              <h2 className="mt-1 text-base font-semibold text-zinc-900">Follow this exact flow each day</h2>
              <div className="mt-4 flex flex-col gap-3">
                {[
                  {
                    step: "01",
                    title: "Check Subscriptions",
                    text: "Review the repos you currently follow and remove any that no longer match your goals.",
                    href: "#subscriptions",
                    cta: "Open Subscriptions",
                  },
                  {
                    step: "02",
                    title: "Add New Repos",
                    text: "Use repo search to add fresh projects so your digest stays useful and varied.",
                    href: "#find-repos",
                    cta: "Find Repositories",
                  },
                  {
                    step: "03",
                    title: "Take Action Daily",
                    text: "When digest emails arrive, pick one issue and make one small contribution step.",
                    href: "/",
                    cta: "View Workflow",
                  },
                ].map((item) => (
                  <article key={item.step} className="rounded-xl border border-zinc-100 bg-zinc-50/90 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">Step {item.step}</p>
                    <p className="mt-1 text-sm font-semibold text-zinc-900">{item.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-600">{item.text}</p>
                    <Link href={item.href} className="mt-3 inline-block text-xs font-medium text-zinc-900 underline-offset-2 hover:underline">
                      {item.cta}
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </div>

          {/* COL 2 — Subscriptions */}
          <div id="subscriptions" className="animate-fade-up h-full min-h-0 scroll-mt-6 lg:h-[640px]" style={{ animationDelay: "160ms" }}>
            <MySubscriptions />
          </div>

          {/* COL 3 — Discover */}
          <div id="find-repos" className="animate-fade-up h-full min-h-0 scroll-mt-6 lg:h-[640px]" style={{ animationDelay: "240ms" }}>
            <RepoSearch />
          </div>

        </div>

        {/* FOOTER */}
        <footer className="animate-fade-up rounded-2xl border border-zinc-200/80 bg-white/85 px-6 py-6 shadow-[0_8px_24px_rgba(0,0,0,0.05)]" style={{ animationDelay: "320ms" }}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-zinc-900">OpenContributers</p>
              <p className="mt-0.5 text-xs text-zinc-500">Small daily steps toward meaningful open source impact.</p>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-zinc-500">
              <Link href="/" className="transition hover:text-zinc-900">Home</Link>
              <a href="https://github.com/devansh-jagtap/openContributers" target="_blank" rel="noreferrer" className="transition hover:text-zinc-900">GitHub</a>
              <a href="https://github.com/devansh-jagtap/openContributers/issues" target="_blank" rel="noreferrer" className="transition hover:text-zinc-900">Issues</a>
            </div>
          </div>
          <div className="mt-4 border-t border-zinc-100 pt-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-zinc-400">© 2026 OpenContributers. Open source under MIT.</p>
            <p className="text-xs text-zinc-400">Made by <a href="https://github.com/devansh-jagtap" target="_blank" rel="noreferrer" className="font-medium text-zinc-600 hover:text-zinc-900 transition">Devansh Jagtap</a></p>
          </div>
        </footer>

      </div>
    </main>
  )
}