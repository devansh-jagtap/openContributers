import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const pageParam = Number(req.nextUrl.searchParams.get("page") ?? "1")
  const page = Number.isFinite(pageParam) && pageParam > 0 ? Math.floor(pageParam) : 1
  const pageSize = 5

  const totalCount = await prisma.subscription.count({
    where: { userId: session.user.id, active: true },
  })
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const safePage = Math.min(page, totalPages)

  const subscriptions = await prisma.subscription.findMany({
    where: { userId: session.user.id, active: true },
    include: { repo: true },
    orderBy: { createdAt: "desc" },
    skip: (safePage - 1) * pageSize,
    take: pageSize,
  })

  return NextResponse.json({
    subscriptions,
    page: safePage,
    totalPages,
    totalCount,
    pageSize,
  })
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { repoId } = await req.json()

  await prisma.subscription.deleteMany({
    where: { userId: session.user.id, repoId },
  })

  return NextResponse.json({ message: "Unsubscribed" })
}