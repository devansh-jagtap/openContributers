import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import RepoSearch from "@/components/RepoSearch"
import MySubscriptions from "@/components/MySubscriptions"
import SignOutButton from "@/components/SignOutButton"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <main className="landing-shell min-h-screen px-6 py-8 sm:px-10">
      <div className="landing-ambient" aria-hidden="true">
        <span className="landing-orb landing-orb-one" />
        <span className="landing-orb landing-orb-two" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="animate-fade-up rounded-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.07)] sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt="avatar"
                  className="h-14 w-14 rounded-full border border-zinc-200 object-cover"
                />
              )}
              <div>
                <Link href="/" className="text-xs font-medium text-zinc-400 hover:text-zinc-600 transition">
                  OpenContributers
                </Link>
                <h1 className="text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">
                  Welcome, {session.user?.name ?? "Contributor"}
                </h1>
                <p className="text-sm text-zinc-500">{session.user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Link
                href="/"
                className="rounded-lg border border-zinc-200 px-4 py-2 text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-100"
              >
                Home
              </Link>
              <SignOutButton />
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-zinc-100 bg-zinc-50/90 p-4 sm:p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">Direction Guide</p>
            <h2 className="mt-1 text-base font-semibold text-zinc-900 sm:text-lg">Follow this exact flow each day</h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
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
                <article key={item.step} className="rounded-xl border border-zinc-100 bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">Step {item.step}</p>
                  <p className="mt-1 text-sm font-semibold text-zinc-900">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-600">{item.text}</p>
                  <Link href={item.href} className="mt-3 inline-block text-sm font-medium text-zinc-900 underline-offset-2 hover:underline">
                    {item.cta}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </header>

        <div id="subscriptions" className="animate-fade-up scroll-mt-6" style={{ animationDelay: "120ms" }}>
          <MySubscriptions />
        </div>

        <div id="find-repos" className="animate-fade-up scroll-mt-6" style={{ animationDelay: "220ms" }}>
          <RepoSearch />
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
            <p className="text-xs text-zinc-400">
              Made by{" "}
              <a href="https://github.com/devansh-jagtap" target="_blank" rel="noreferrer" className="font-medium text-zinc-600 hover:text-zinc-900 transition">
                Devansh Jagtap
              </a>
            </p>
          </div>
        </footer>

      </div>
    </main>
  )
}