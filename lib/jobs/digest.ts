import { render } from "@react-email/components"
import EmailConfirmation from "@/emails/EmailConfirmation"
import IssueDigest from "@/emails/IssueDigest"
import { FROM_EMAIL, sendEmail } from "@/lib/mailer"
import { prisma } from "@/lib/prisma"

export function localDateKey(date: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date)

  const value = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? ""

  return `${value("year")}-${value("month")}-${value("day")}`
}

function localTime(date: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date)

  const value = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "00"

  return `${value("hour")}:${value("minute")}`
}

function alreadySentToday(
  lastDigestSentAt: Date | null,
  now: Date,
  timezone: string
) {
  if (!lastDigestSentAt) return false
  return localDateKey(lastDigestSentAt, timezone) === localDateKey(now, timezone)
}

export async function findDueDigestUsers(now = new Date(), limit = 20) {
  const users = await prisma.user.findMany({
    where: {
      email: { not: null },
      emailConfirmedAt: { not: null },
      subscriptions: { some: { active: true } },
    },
    select: {
      id: true,
      timezone: true,
      preferredSendTime: true,
      lastDigestSentAt: true,
    },
    orderBy: { createdAt: "asc" },
  })

  return users
    .filter((user) => {
      if (alreadySentToday(user.lastDigestSentAt, now, user.timezone)) {
        return false
      }
      return localTime(now, user.timezone) === user.preferredSendTime
    })
    .slice(0, limit)
}

export async function sendDueDigests(now = new Date(), limit = 20) {
  const users = await findDueDigestUsers(now, limit)
  const results = []

  for (const user of users) {
    await sendDigestToUser(user.id)
    results.push({ userId: user.id, preferredSendTime: user.preferredSendTime })
  }

  return results
}

export async function sendDigestToUser(userId: string) {
  const appUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000"
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      subscriptions: {
        where: { active: true },
        include: {
          repo: {
            include: {
              issues: {
                where: { state: "open" },
                orderBy: { githubCreatedAt: "asc" },
              },
            },
          },
        },
      },
      emailLogs: { select: { issueId: true } },
    },
  })

  if (!user?.email || !user.emailConfirmedAt) {
    console.log(`[sendDigest] Skipping ${userId} — email is not confirmed`)
    return { sent: 0 }
  }

  const sentIssueIds = new Set(user.emailLogs.map((log) => log.issueId))
  const failures: Error[] = []
  let sent = 0

  for (const subscription of user.subscriptions) {
    const { repo, issuesPerDay } = subscription
    const unsentIssues = repo.issues.filter(
      (issue) => !sentIssueIds.has(issue.id)
    )

    const batch = unsentIssues.slice(0, issuesPerDay)

    for (const issue of batch) {
      try {
        const html = await render(
          IssueDigest({
            userName: user.name ?? user.username ?? "contributor",
            repoFullName: repo.fullName,
            issueNumber: issue.githubNumber,
            issueTitle: issue.title,
            issueBody: issue.body ?? null,
            issueUrl: issue.url,
            labels: issue.labels,
            manageUrl: new URL("/dashboard", appUrl).toString(),
          })
        )

        await sendEmail({
          from: FROM_EMAIL,
          to: user.email,
          subject: `[${repo.fullName}] #${issue.githubNumber} — ${issue.title}`,
          html,
        })

        await prisma.emailLog.create({
          data: { userId: user.id, issueId: issue.id },
        })

        sentIssueIds.add(issue.id)
        sent += 1
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        failures.push(error)
        console.error(
          `[sendDigest] ✗ Failed issue ${issue.id} → ${user.email}:`,
          error
        )
      }
    }
  }

  if (failures.length > 0) {
    throw new Error(`${failures.length} digest email(s) failed`)
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastDigestSentAt: new Date() },
  })

  return { sent }
}

export async function sendEmailConfirmation(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      email: true,
      name: true,
      username: true,
      emailConfirmedAt: true,
      emailConfirmationToken: true,
      emailConfirmationExpires: true,
    },
  })

  if (!user?.email || user.emailConfirmedAt) return
  if (!user.emailConfirmationToken || !user.emailConfirmationExpires) {
    throw new Error("Email confirmation token is missing")
  }
  if (user.emailConfirmationExpires <= new Date()) {
    throw new Error("Email confirmation token has expired")
  }

  const appUrl = process.env.NEXTAUTH_URL
  if (!appUrl) throw new Error("NEXTAUTH_URL is required for email confirmation")

  const confirmationUrl = new URL("/api/email/confirm", appUrl)
  confirmationUrl.searchParams.set("token", user.emailConfirmationToken)

  const html = await render(
    EmailConfirmation({
      userName: user.name ?? user.username ?? "contributor",
      confirmationUrl: confirmationUrl.toString(),
    })
  )

  await sendEmail({
    from: FROM_EMAIL,
    to: user.email,
    subject: "Confirm your OpenContributers email",
    html,
  })
}
