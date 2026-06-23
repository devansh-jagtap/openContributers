import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { queueEmailConfirmation } from "@/lib/emailConfirmation"

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await queueEmailConfirmation(session.user.id)
  return NextResponse.json({ message: "A fresh confirmation email has been queued." })
}
