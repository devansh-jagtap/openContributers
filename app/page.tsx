import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignOutButton from "@/components/SignOutButton";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="landing-shell min-h-screen">
      <div className="landing-ambient" aria-hidden="true">
        <span className="landing-orb landing-orb-one" />
        <span className="landing-orb landing-orb-two" />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col px-6 pb-8 pt-8 sm:px-10 sm:pb-10 lg:px-12">
        {/* NAVBAR */}
        <header className="animate-fade-up flex items-center justify-between rounded-2xl border border-black/5 bg-white/85 dark:border-white/10 dark:bg-zinc-900/85 px-5 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur">
          <Link
            href="/"
            className="text-base font-semibold tracking-tight text-zinc-900 dark:text-white"
          >
            OpenContributers
          </Link>
          <nav className="flex items-center gap-2 text-sm">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-lg border border-zinc-200 px-4 py-2 text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
                >
                  Dashboard
                </Link>
                <SignOutButton />
                <ThemeToggle />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg border border-zinc-200 px-4 py-2 text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
                >
                  Login
                </Link>
                <Link
                  href="/login"
                  className="rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                >
                  Get Started
                </Link>
                <ThemeToggle />
              </>
            )}
          </nav>
        </header>

        {/* HERO */}
        <section
          className="animate-fade-up mt-14 grid gap-10 lg:mt-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center"
          style={{ animationDelay: "120ms" }}
        >
          <div className="space-y-6">
            <p className="inline-flex rounded-full border border-zinc-200 bg-white/90 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-zinc-400">
              Daily open source habit
            </p>
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-5xl lg:text-6xl">
              One issue a day.
              <br />
              Real contribution momentum.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg">
              OpenContributers curates small, actionable issues from
              repositories you follow and delivers them to your inbox, so
              contributing feels consistent instead of overwhelming.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/login"
                className="rounded-xl bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
              >
                Start With GitHub
              </Link>
              <Link
                href="/dashboard"
                className="rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-medium text-zinc-800 transition hover:-translate-y-0.5 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-700"
              >
                View Dashboard
              </Link>
            </div>
          </div>

          <div className="animate-float rounded-3xl border border-zinc-200/80 bg-white/90 dark:border-zinc-800/80 dark:bg-zinc-900/90 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-7">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
              Today&apos;s flow
            </p>
            <div className="mt-4 space-y-3">
              {[
                "Pick repositories you care about",
                "Receive open issues daily in your inbox",
                "Triage, comment, fix — contributions compound",
              ].map((item, index) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-zinc-100 bg-zinc-50/90 dark:border-zinc-800/50 dark:bg-zinc-800/50 p-3"
                >
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HIGHLIGHTS */}
        <section
          className="mt-14 grid gap-4 sm:grid-cols-3"
          aria-label="Product highlights"
        >
          {[
            {
              title: "Focused",
              description:
                "Small daily tasks keep contribution sustainable and stress-free.",
            },
            {
              title: "Automated",
              description:
                "Background jobs sync fresh issues every 6 hours from GitHub.",
            },
            {
              title: "Consistent",
              description:
                "Daily digest emails keep your contribution rhythm alive.",
            },
          ].map((feature, i) => (
            <article
              key={feature.title}
              className="animate-fade-up rounded-2xl border border-zinc-200/80 bg-white/85 dark:border-zinc-800/80 dark:bg-zinc-900/85 p-5 shadow-[0_8px_24px_rgba(0,0,0,0.05)]"
              style={{ animationDelay: `${220 + i * 120}ms` }}
            >
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {feature.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {feature.description}
              </p>
            </article>
          ))}
        </section>

        {/* FEATURES */}
        <section className="mt-14 rounded-3xl border border-zinc-200/80 bg-white/90 dark:border-zinc-800/80 dark:bg-zinc-900/90 p-6 shadow-[0_12px_32px_rgba(0,0,0,0.06)] sm:p-8">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
              Features
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
              Built for steady contribution, not occasional bursts.
            </h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              {
                title: "Smart Repo Discovery",
                description:
                  "Search repositories by name, inspect language and star signals, then subscribe in one click.",
              },
              {
                title: "Subscription Control",
                description:
                  "Manage your active repos from the dashboard. Add or remove anytime without losing your history.",
              },
              {
                title: "Daily Digest Engine",
                description:
                  "BullMQ workers dispatch fresh open issues every day automatically. No duplicates ever sent.",
              },
              {
                title: "Habit-First Workflow",
                description:
                  "One issue per day. Small enough to be painless, consistent enough to actually compound.",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-zinc-100 bg-zinc-50/90 dark:border-zinc-800/50 dark:bg-zinc-800/50 p-5"
              >
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="mt-10 rounded-3xl bg-zinc-900 dark:bg-zinc-100 p-8 text-center sm:p-10">
          <h2 className="text-2xl font-semibold text-white dark:text-zinc-900 sm:text-3xl">
            Ready to build the habit?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400 dark:text-zinc-600">
            Join developers who are turning occasional open source interest into
            daily contribution momentum.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-medium text-zinc-900 transition hover:-translate-y-0.5 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 fill-zinc-900 dark:fill-white"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Start with GitHub — it&apos;s free
          </Link>
        </section>

        {/* FOOTER */}
        <footer className="mt-8 rounded-2xl border border-zinc-200/80 bg-white/85 dark:border-zinc-800/80 dark:bg-zinc-900/85 px-6 py-8 shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-xs">
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                OpenContributers
              </p>
              <p className="mt-1 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                Small daily steps toward meaningful open source impact. Built by
                developers, for developers.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm text-zinc-600 dark:text-zinc-400 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-500">
                  Product
                </p>
                <Link
                  href="/"
                  className="transition hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  Home
                </Link>
                <Link
                  href="/dashboard"
                  className="transition hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  Dashboard
                </Link>
                <Link
                  href="/login"
                  className="transition hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  Login
                </Link>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-500">
                  Open Source
                </p>
                <a
                  href="https://github.com/devansh-jagtap/openContributers"
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  GitHub
                </a>
                <a
                  href="https://github.com/devansh-jagtap/openContributers/issues"
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  Issues
                </a>
                <a
                  href="https://github.com/devansh-jagtap/openContributers/blob/main/README.md"
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  Docs
                </a>
              </div>
            </div>
          </div>
          <div className="mt-6 border-t border-zinc-100 dark:border-zinc-800 pt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              © 2026 OpenContributers. Open source under MIT.
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              Made by{" "}
              <a
                href="https://github.com/devansh-jagtap"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                Devansh Jagtap
              </a>
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
