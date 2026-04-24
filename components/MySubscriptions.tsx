"use client"

import { useEffect, useState } from "react"

interface Repo {
  id: string
  fullName: string
  description: string | null
  stars: number
  language: string | null
}

interface Subscription {
  id: string
  repoId: string
  createdAt: string
  repo: Repo
}

export default function MySubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [unsubscribing, setUnsubscribing] = useState<string | null>(null)

  useEffect(() => {
    fetchSubscriptions()

    const handleSubscriptionChanged = () => {
      fetchSubscriptions()
    }

    window.addEventListener("subscription:changed", handleSubscriptionChanged)

    return () => {
      window.removeEventListener("subscription:changed", handleSubscriptionChanged)
    }
  }, [])

  async function fetchSubscriptions() {
    const res = await fetch("/api/subscriptions")
    const data = await res.json()
    setSubscriptions(data.subscriptions ?? [])
    setLoading(false)
  }

  async function handleUnsubscribe(repoId: string) {
    setUnsubscribing(repoId)
    await fetch("/api/subscriptions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repoId }),
    })
    setSubscriptions(prev => prev.filter(s => s.repoId !== repoId))
    window.dispatchEvent(new CustomEvent("subscription:changed"))
    setUnsubscribing(null)
  }

  if (loading) {
    return (
      <section className="rounded-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
        <p className="text-sm text-zinc-500">Loading subscriptions...</p>
      </section>
    )
  }

  if (subscriptions.length === 0) {
    return (
      <section className="rounded-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
        <h2 className="mb-2 text-lg font-semibold text-zinc-900">My subscriptions</h2>
        <p className="text-sm text-zinc-500">You haven&apos;t subscribed to any repos yet. Search below to get started.</p>
      </section>
    )
  }

  return (
    <section className="rounded-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
      <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">Active Repositories</p>
      <h2 className="mt-1 text-lg font-semibold text-zinc-900">
        My subscriptions ({subscriptions.length})
      </h2>

      <div className="mt-4 flex flex-col gap-3">
        {subscriptions.map(sub => (
          <article key={sub.id} className="flex items-start justify-between gap-4 rounded-xl border border-zinc-100 bg-zinc-50/80 p-4">
            <div className="flex flex-col gap-1">
              <a
                href={`https://github.com/${sub.repo.fullName}`}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-zinc-900 hover:underline"
              >
                {sub.repo.fullName}
              </a>
              {sub.repo.description && (
                <p className="line-clamp-2 text-sm text-zinc-500">{sub.repo.description}</p>
              )}
              <div className="mt-1 flex gap-3 text-xs text-zinc-400">
                {sub.repo.language && <span>⬡ {sub.repo.language}</span>}
                <span>★ {sub.repo.stars.toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={() => handleUnsubscribe(sub.repoId)}
              disabled={unsubscribing === sub.repoId}
              className="shrink-0 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
            >
              {unsubscribing === sub.repoId ? "Removing..." : "Unsubscribe"}
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}