import { Queue } from "bullmq"
import IORedis from "ioredis"

const isUpstash = process.env.REDIS_URL?.startsWith("rediss://")

export const redisConnection = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
  tls: isUpstash ? {} : undefined,
})

export const syncQueue = new Queue("sync-repo", {
  connection: redisConnection,
})

export const digestQueue = new Queue("send-digest", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: 100,
    removeOnFail: 50,
  },
})

export async function scheduleDailyDigest() {
  await digestQueue.removeJobScheduler("daily-digest")

  await digestQueue.upsertJobScheduler(
    "daily-digest",
    { pattern: "0 3 * * *" },
    {
      name: "dispatch-digest",
      data: {},
    }
  )

  console.log("[queue] Daily digest scheduled at 03:00 UTC")
}