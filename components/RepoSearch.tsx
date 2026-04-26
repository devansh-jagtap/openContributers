"use client"

import { useState } from "react"

interface Repo {
  id: number
  owner: string
  name: string
  fullName: string
  description: string
  stars: number
  language: string
}

export default function RepoSearch() {
  const [query, setQuery] = useState("")
  const [repos, setRepos] = useState<Repo[]>([])
  const [loading, setLoading] = useState(false)
  const [subscribing, setSubscribing] = useState<string | null>(null)
  const [subscribed, setSubscribed] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  async function handleSearch(targetPage = 1) {
    if (!query.trim()) return
    setLoading(true)
    const res = await fetch(`/api/repos/search?q=${encodeURIComponent(query)}&page=${targetPage}`)
    const data = await res.json()
    setRepos(data.repos ?? [])
    setPage(data.page ?? 1)
    setTotalPages(data.totalPages ?? 1)
    setLoading(false)
  }

  async function handleSubscribe(repo: Repo) {
    setSubscribing(repo.fullName)
    const res = await fetch("/api/repos/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        owner: repo.owner,
        name: repo.name,
        description: repo.description,
        stars: repo.stars,
        language: repo.language,
      }),
    })
    if (res.ok) {
      setSubscribed(prev => new Set(prev).add(repo.fullName))
      window.dispatchEvent(new Event("subscriptions-updated"))
    }
    setSubscribing(null)
  }

  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl border border-zinc-200/80 bg-white/90 dark:border-zinc-800/80 dark:bg-zinc-900/90 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] sm:p-7">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">Discover</p>
      <h2 className="mt-1 text-lg font-semibold text-zinc-900">Find a repo to contribute to</h2>

      <div className="mt-5 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSearch()}
          placeholder='Try "react" or "facebook/react"'
          className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50/80 px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 dark:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
        />
        <button
          onClick={() => handleSearch(1)}
          disabled={loading}
          className="rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {repos.length > 0 && (
        <>
          <div className="themed-scrollbar mt-4 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1">
            {repos.map(repo => (
              <div
                key={repo.id}
                className="flex items-start justify-between gap-4 rounded-xl border border-zinc-100 bg-zinc-50/80 p-4"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <a
                    href={`https://github.com/${repo.fullName}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:underline underline-offset-2 truncate"
                  >
                    {repo.fullName}
                  </a>
                  <p className="text-xs leading-relaxed text-zinc-500 line-clamp-2">{repo.description}</p>
                  <div className="flex gap-3 mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                    {repo.language && <span>⬡ {repo.language}</span>}
                    <span>★ {repo.stars.toLocaleString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleSubscribe(repo)}
                  disabled={subscribing === repo.fullName || subscribed.has(repo.fullName)}
                  className="shrink-0 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {subscribed.has(repo.fullName)
                    ? "Subscribed ✓"
                    : subscribing === repo.fullName
                    ? "Adding..."
                    : "Subscribe"}
                </button>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50/80 px-3 py-2">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 dark:text-zinc-500">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSearch(page - 1)}
                  disabled={loading || page <= 1}
                  className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => handleSearch(page + 1)}
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

      {repos.length === 0 && !loading && query && (
        <div className="mt-4 rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 p-6 text-center">
          <p className="text-sm text-zinc-500">No results found for "{query}"</p>
        </div>
      )}
    </div>
  )
}