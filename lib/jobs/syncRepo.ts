import { prisma } from "@/lib/prisma"

type SyncRepositoryInput = {
  repoId: string
  owner: string
  name: string
  githubToken?: string | null
}

export async function syncRepository({
  repoId,
  owner,
  name,
  githubToken,
}: SyncRepositoryInput) {
  if (!repoId || !owner || !name) {
    throw new Error("syncRepository is missing repository data")
  }

  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  }
  if (githubToken) {
    headers.Authorization = `Bearer ${githubToken}`
  }

  const url = `https://api.github.com/repos/${owner}/${name}/issues?state=open&per_page=100`
  let response = await fetch(url, { headers })

  if (response.status === 401) {
    response = await fetch(url, {
      headers: { Accept: "application/vnd.github.v3+json" },
    })
  }

  if (!response.ok) {
    throw new Error(`GitHub API error for ${owner}/${name}: ${response.status}`)
  }

  const issues = await response.json()

  for (const issue of issues) {
    if (issue.pull_request) continue

    await prisma.issue.upsert({
      where: {
        repoId_githubNumber: {
          repoId,
          githubNumber: issue.number,
        },
      },
      update: {
        title: issue.title,
        body: issue.body,
        state: issue.state,
        labels: issue.labels.map((label: any) => label.name),
      },
      create: {
        repoId,
        githubNumber: issue.number,
        title: issue.title,
        body: issue.body ?? "",
        url: issue.html_url,
        state: issue.state,
        labels: issue.labels.map((label: any) => label.name),
        githubCreatedAt: new Date(issue.created_at),
      },
    })
  }

  await prisma.repo.update({
    where: { id: repoId },
    data: { lastSyncedAt: new Date() },
  })

  return { issueCount: issues.filter((issue: any) => !issue.pull_request).length }
}

export async function syncStaleRepositories(limit = 5) {
  const staleBefore = new Date(Date.now() - 6 * 60 * 60 * 1000)

  const repos = await prisma.repo.findMany({
    where: {
      subscriptions: { some: { active: true } },
      OR: [{ lastSyncedAt: null }, { lastSyncedAt: { lte: staleBefore } }],
    },
    orderBy: [{ lastSyncedAt: "asc" }, { createdAt: "asc" }],
    take: limit,
    include: {
      subscriptions: {
        where: { active: true },
        include: {
          user: {
            include: {
              accounts: {
                where: { provider: "github" },
                select: { access_token: true },
                take: 1,
              },
            },
          },
        },
        take: 1,
      },
    },
  })

  const results = []
  for (const repo of repos) {
    const githubToken =
      repo.subscriptions[0]?.user.accounts[0]?.access_token ?? null

    results.push({
      repo: repo.fullName,
      ...(await syncRepository({
        repoId: repo.id,
        owner: repo.owner,
        name: repo.name,
        githubToken,
      })),
    })
  }

  return results
}
