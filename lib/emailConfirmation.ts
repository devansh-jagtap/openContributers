import { randomBytes } from "crypto"
import { prisma } from "@/lib/prisma"
import { digestQueue } from "@/lib/queue"

const CONFIRMATION_TTL_MS = 24 * 60 * 60 * 1000

export async function queueEmailConfirmation(userId: string) {
  const token = randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + CONFIRMATION_TTL_MS)

  await prisma.user.update({
    where: { id: userId },
    data: {
      emailConfirmationToken: token,
      emailConfirmationExpires: expiresAt,
    },
  })

  await digestQueue.add(
    "send-email-confirmation",
    { userId },
    {
      jobId: `email-confirmation-${userId}-${token}`,
      attempts: 3,
      backoff: { type: "exponential", delay: 5000 },
    }
  )
}
