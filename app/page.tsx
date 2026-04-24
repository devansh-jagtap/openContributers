import Link from "next/link";

export default function Home() {
  return (
    <main className="landing-shell min-h-screen">
      <div className="landing-ambient" aria-hidden="true">
        <span className="landing-orb landing-orb-one" />
        <span className="landing-orb landing-orb-two" />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col px-6 pb-20 pt-8 sm:px-10 lg:px-12">
        <header className="animate-fade-up flex items-center justify-between rounded-2xl border border-black/5 bg-white/85 px-5 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur">
          <Link href="/" className="text-base font-semibold tracking-tight text-zinc-900">
            OpenContributers
          </Link>

          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/login"
              className="rounded-lg border border-zinc-200 px-4 py-2 text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-100"
            >
              Login
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white transition hover:bg-zinc-700"
            >
              Dashboard
            </Link>
          </nav>
        </header>

        <section className="animate-fade-up mt-14 grid gap-10 lg:mt-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center" style={{ animationDelay: "120ms" }}>
          <div className="space-y-6">
            <p className="inline-flex rounded-full border border-zinc-200 bg-white/90 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
              Daily open source habit
            </p>
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl">
              One issue a day.
              <br />
              Real contribution momentum.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg">
              OpenContributers curates small, actionable issues from repositories you follow and delivers them to your inbox, so contributing feels consistent instead of overwhelming.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/login"
                className="rounded-xl bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-zinc-700"
              >
                Start With GitHub
              </Link>
              <Link
                href="/dashboard"
                className="rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-medium text-zinc-800 transition hover:-translate-y-0.5 hover:border-zinc-300"
              >
                View Dashboard
              </Link>
            </div>
          </div>

          <div className="animate-float rounded-3xl border border-zinc-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-7">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">Today&apos;s flow</p>
            <div className="mt-4 space-y-3">
              {[
                "Pick repositories you care about",
                "Receive open issues daily",
                "Triaging and contributions compound over time",
              ].map((item, index) => (
                <div key={item} className="flex items-start gap-3 rounded-xl border border-zinc-100 bg-zinc-50/90 p-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-zinc-700">{item}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm text-zinc-500">
              Connected pages: Login for auth, Dashboard for subscriptions and repo search.
            </p>
          </div>
        </section>

        <section className="mt-14 grid gap-4 sm:grid-cols-3" aria-label="Product highlights">
          {[
            {
              title: "Focused",
              description: "Small daily tasks keep contribution sustainable.",
            },
            {
              title: "Connected",
              description: "Seamlessly move from login to dashboard workflow.",
            },
            {
              title: "Consistent",
              description: "Automated digests keep your contribution rhythm alive.",
            },
          ].map((feature, i) => (
            <article
              key={feature.title}
              className="animate-fade-up rounded-2xl border border-zinc-200/80 bg-white/85 p-5 shadow-[0_8px_24px_rgba(0,0,0,0.05)]"
              style={{ animationDelay: `${220 + i * 120}ms` }}
            >
              <h2 className="text-lg font-semibold text-zinc-900">{feature.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">{feature.description}</p>
            </article>
          ))}
        </section>

        <section className="mt-14 rounded-3xl border border-zinc-200/80 bg-white/90 p-6 shadow-[0_12px_32px_rgba(0,0,0,0.06)] sm:p-8" aria-label="Features">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">Features</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
              Built for steady contribution, not occasional bursts.
            </h2>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              {
                title: "Smart Repo Discovery",
                description: "Search repositories, inspect language and star signals, then subscribe in one click.",
              },
              {
                title: "Subscription Control",
                description: "Manage your active repos from the dashboard without losing focus.",
              },
              {
                title: "Daily Digest Engine",
                description: "Background jobs dispatch fresh open issues every day, automatically.",
              },
              {
                title: "Habit-First Workflow",
                description: "A simple routine: login, review one issue, and ship a small improvement.",
              },
            ].map((item) => (
              <article key={item.title} className="rounded-2xl border border-zinc-100 bg-zinc-50/90 p-5">
                <h3 className="text-base font-semibold text-zinc-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <footer className="mt-12 flex flex-col gap-5 border-t border-zinc-200/80 py-8 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-zinc-900">OpenContributers</p>
            <p className="mt-1">Small daily steps toward meaningful open source impact.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/" className="transition hover:text-zinc-900">Home</Link>
            <Link href="/login" className="transition hover:text-zinc-900">Login</Link>
            <Link href="/dashboard" className="transition hover:text-zinc-900">Dashboard</Link>
            <a
              href="https://github.com/devansh-jagtap/openContributers"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-zinc-900"
            >
              GitHub
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
