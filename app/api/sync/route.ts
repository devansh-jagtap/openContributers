import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { syncQueue } from "@/lib/queue"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { repoId } = await req.json()

  const repo = await prisma.repo.findUnique({ where: { id: repoId } })
  if (!repo) return NextResponse.json({ error: "Repo not found" }, { status: 404 })

  await syncQueue.add("sync-repo", {
    repoId: repo.id,
    owner: repo.owner,
    name: repo.name,
    githubToken: session.user.githubToken,
  })

  return NextResponse.json({ message: "Sync started" })
}