import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const query = req.nextUrl.searchParams.get("q")
  if (!query) return NextResponse.json({ error: "Query required" }, { status: 400 })

  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  }

  if (session.user.githubToken) {
    headers["Authorization"] = `Bearer ${session.user.githubToken}`
  }

  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&per_page=10`
  
  let response = await fetch(url, { headers })

  if (response.status === 401) {
    const fallbackHeaders = { Accept: "application/vnd.github.v3+json" }
    response = await fetch(url, { headers: fallbackHeaders })
  }

  const data = await response.json()

  if (!response.ok) {
    return NextResponse.json({ error: data.message ?? "GitHub API error" }, { status: 500 })
  }

  const repos = (data.items ?? []).map((repo: any) => ({
    id: repo.id,
    owner: repo.owner.login,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    stars: repo.stargazers_count,
    language: repo.language,
    url: repo.html_url,
  }))

  return NextResponse.json({ repos })
}