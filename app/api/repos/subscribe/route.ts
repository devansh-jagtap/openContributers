import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { owner, name, description, stars, language } = await req.json()

  if (!owner || !name) {
    return NextResponse.json({ error: "Owner and name required" }, { status: 400 })
  }

  const repo = await prisma.repo.upsert({
    where: { fullName: `${owner}/${name}` },
    update: { stars, description, language },
    create: {
      owner,
      name,
      fullName: `${owner}/${name}`,
      description,
      stars: stars ?? 0,
      language,
    },
  })

  const existing = await prisma.subscription.findUnique({
    where: { userId_repoId: { userId: session.user.id, repoId: repo.id } },
  })

  if (existing) {
    return NextResponse.json({ message: "Already subscribed", repo })
  }

  const subscription = await prisma.subscription.create({
    data: {
      userId: session.user.id,
      repoId: repo.id,
    },
  })

  return NextResponse.json({ message: "Subscribed!", repo, subscription })
}