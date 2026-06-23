import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")
  const dashboardUrl = new URL("/dashboard", request.url)

  if (!token) {
    dashboardUrl.searchParams.set("emailConfirmation", "invalid")
    return NextResponse.redirect(dashboardUrl)
  }

  const user = await prisma.user.findFirst({
    where: {
      emailConfirmationToken: token,
      emailConfirmationExpires: { gt: new Date() },
    },
    select: { id: true },
  })

  if (!user) {
    dashboardUrl.searchParams.set("emailConfirmation", "expired")
    return NextResponse.redirect(dashboardUrl)
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailConfirmedAt: new Date(),
      emailConfirmationToken: null,
      emailConfirmationExpires: null,
    },
  })

  dashboardUrl.searchParams.set("emailConfirmation", "success")
  return NextResponse.redirect(dashboardUrl)
}
