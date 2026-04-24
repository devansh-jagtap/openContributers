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

  async function handleSearch() {
    if (!query.trim()) return
    setLoading(true)
    const res = await fetch(`/api/repos/search?q=${encodeURIComponent(query)}`)
    const data = await res.json()
    setRepos(data.repos ?? [])
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
      window.dispatchEvent(new CustomEvent("subscription:changed"))
    }
    setSubscribing(null)
  }

  return (
    <section className="rounded-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">Repository Discovery</p>
        <h2 className="mt-1 text-lg font-semibold text-zinc-900">Find a repo to contribute to</h2>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSearch()}
          placeholder='Search repos e.g. "react" or "facebook/react"'
          className="flex-1 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-300"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {repos.map(repo => (
          <article key={repo.id} className="flex items-start justify-between gap-4 rounded-xl border border-zinc-100 bg-zinc-50/80 p-4">
            <div className="flex flex-col gap-1">
              
              <a
                href={`https://github.com/${repo.fullName}`}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-zinc-900 hover:underline"
              >
                {repo.fullName}
              </a>
              <p className="line-clamp-2 text-sm text-zinc-500">{repo.description}</p>
              <div className="mt-1 flex gap-3 text-xs text-zinc-400">
                {repo.language && <span>⬡ {repo.language}</span>}
                <span>★ {repo.stars.toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={() => handleSubscribe(repo)}
              disabled={subscribing === repo.fullName || subscribed.has(repo.fullName)}
              className="shrink-0 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {subscribed.has(repo.fullName)
                ? "Subscribed ✓"
                : subscribing === repo.fullName
                ? "Adding..."
                : "Subscribe"}
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
