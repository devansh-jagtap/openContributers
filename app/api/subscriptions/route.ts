import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const subscriptions = await prisma.subscription.findMany({
    where: { userId: session.user.id, active: true },
    include: { repo: true },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ subscriptions })
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