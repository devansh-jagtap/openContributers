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
      </div>
    </main>
  );
}
