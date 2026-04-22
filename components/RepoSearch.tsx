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
    }
    setSubscribing(null)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-gray-900">Find a repo to contribute to</h2>

      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSearch()}
          placeholder='Search repos e.g. "react" or "facebook/react"'
          className="flex-1 border text-black border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {repos.map(repo => (
          <div key={repo.id} className="border border-gray-100 rounded-xl p-4 flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              
              <a
                href={`https://github.com/${repo.fullName}`}
                target="_blank"
                className="font-medium text-gray-900 hover:underline"
              >
                {repo.fullName}
              </a>
              <p className="text-sm text-gray-500 line-clamp-2">{repo.description}</p>
              <div className="flex gap-3 mt-1 text-xs text-gray-400">
                {repo.language && <span>⬡ {repo.language}</span>}
                <span>★ {repo.stars.toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={() => handleSubscribe(repo)}
              disabled={subscribing === repo.fullName || subscribed.has(repo.fullName)}
              className="shrink-0 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  )
}
