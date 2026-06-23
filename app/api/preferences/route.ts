import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const preferenceSchema = z.object({
  preferredSendTime: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, "Use HH:mm"),
  timezone: z.string().min(1).max(100),
})

function isValidTimezone(timezone: string) {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone })
    return true
  } catch {
    return false
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      email: true,
      emailConfirmedAt: true,
      preferredSendTime: true,
      timezone: true,
    },
  })

  return NextResponse.json({ user })
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const parsed = preferenceSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid delivery preferences" }, { status: 400 })
  }
  if (!isValidTimezone(parsed.data.timezone)) {
    return NextResponse.json({ error: "Use an IANA timezone such as Asia/Kolkata" }, { status: 400 })
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: parsed.data,
    select: { id: true, preferredSendTime: true, timezone: true },
  })

  return NextResponse.json({ user })
}
