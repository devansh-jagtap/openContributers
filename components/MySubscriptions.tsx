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
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    fetchSubscriptions(1)

    function handleSubscriptionsUpdated() {
      fetchSubscriptions(1)
    }

    window.addEventListener("subscriptions-updated", handleSubscriptionsUpdated)

    return () => {
      window.removeEventListener("subscriptions-updated", handleSubscriptionsUpdated)
    }
  }, [])

  async function fetchSubscriptions(targetPage = page) {
    setLoading(true)
    const res = await fetch(`/api/subscriptions?page=${targetPage}`)
    const data = await res.json()
    setSubscriptions(data.subscriptions ?? [])
    setPage(data.page ?? 1)
    setTotalPages(data.totalPages ?? 1)
    setTotalCount(data.totalCount ?? 0)
    setLoading(false)
    return data
  }

  async function handleUnsubscribe(repoId: string) {
    setUnsubscribing(repoId)
    await fetch("/api/subscriptions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repoId }),
    })
    const refreshed = await fetchSubscriptions(page)
    if ((refreshed.subscriptions ?? []).length === 0 && page > 1) {
      await fetchSubscriptions(page - 1)
    }
    setUnsubscribing(null)
  }

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] sm:p-7">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">Subscriptions</p>
          <h2 className="mt-1 text-lg font-semibold text-zinc-900">
            {loading ? "Loading..." : `My repos (${totalCount})`}
          </h2>
        </div>
      </div>

      {!loading && subscriptions.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/80 p-8 text-center">
          <p className="text-sm text-zinc-500">No subscriptions yet.</p>
          <p className="mt-1 text-xs text-zinc-400">Search for repos below and subscribe to get started.</p>
        </div>
      )}

      {!loading && subscriptions.length > 0 && (
        <>
          <div className="mt-5 flex flex-col gap-3">
            {subscriptions.map(sub => (
              <div
                key={sub.id}
                className="flex items-start justify-between gap-4 rounded-xl border border-zinc-100 bg-zinc-50/80 p-4"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <a
                    href={`https://github.com/${sub.repo.fullName}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-zinc-900 hover:underline underline-offset-2 truncate"
                  >
                    {sub.repo.fullName}
                  </a>
                  {sub.repo.description && (
                    <p className="text-xs leading-relaxed text-zinc-500 line-clamp-2">{sub.repo.description}</p>
                  )}
                  <div className="flex gap-3 mt-1 text-xs text-zinc-400">
                    {sub.repo.language && <span>⬡ {sub.repo.language}</span>}
                    <span>★ {sub.repo.stars.toLocaleString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleUnsubscribe(sub.repoId)}
                  disabled={unsubscribing === sub.repoId}
                  className="shrink-0 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                >
                  {unsubscribing === sub.repoId ? "Removing..." : "Unsubscribe"}
                </button>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50/80 px-3 py-2">
              <p className="text-xs text-zinc-500">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchSubscriptions(page - 1)}
                  disabled={loading || page <= 1}
                  className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => fetchSubscriptions(page + 1)}
                  disabled={loading || page >= totalPages}
                  className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}