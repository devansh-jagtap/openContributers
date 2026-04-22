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
    setUnsubscribing(null)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <p className="text-gray-400 text-sm">Loading subscriptions...</p>
      </div>
    )
  }

  if (subscriptions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">My subscriptions</h2>
        <p className="text-gray-400 text-sm">You haven't subscribed to any repos yet. Search above to get started!</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-gray-900">
        My subscriptions ({subscriptions.length})
      </h2>
      <div className="flex flex-col gap-3">
        {subscriptions.map(sub => (
          <div key={sub.id} className="border border-gray-100 rounded-xl p-4 flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <a
                href={`https://github.com/${sub.repo.fullName}`}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-gray-900 hover:underline"
              >
                {sub.repo.fullName}
              </a>
              {sub.repo.description && (
                <p className="text-sm text-gray-500 line-clamp-2">{sub.repo.description}</p>
              )}
              <div className="flex gap-3 mt-1 text-xs text-gray-400">
                {sub.repo.language && <span>⬡ {sub.repo.language}</span>}
                <span>★ {sub.repo.stars.toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={() => handleUnsubscribe(sub.repoId)}
              disabled={unsubscribing === sub.repoId}
              className="shrink-0 border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors disabled:opacity-50"
            >
              {unsubscribing === sub.repoId ? "Removing..." : "Unsubscribe"}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}