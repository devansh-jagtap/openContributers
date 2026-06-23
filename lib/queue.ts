import { Queue } from "bullmq"
import IORedis from "ioredis"

const isUpstash = process.env.REDIS_URL?.startsWith("rediss://")

export const redisConnection = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
  tls: isUpstash ? {} : undefined,
})

export const syncQueue = new Queue("sync-repo", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: 100,
    removeOnFail: 50,
  },
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

export async function scheduleWorkerJobs() {
  // Retire old schedulers. A single dispatcher now checks user preferences
  // every minute, which avoids creating one repeatable Redis schedule per user.
  await digestQueue.removeJobScheduler("daily-digest")

  await digestQueue.upsertJobScheduler(
    "dispatch-due-digests",
    { pattern: "* * * * *" },
    {
      name: "dispatch-due-digests",
      data: {},
    }
  )

  await syncQueue.upsertJobScheduler(
    "sync-all-repositories",
    { pattern: "0 */6 * * *" },
    {
      name: "dispatch-repo-sync",
      data: {},
    }
  )

  console.log("[queue] Digest dispatcher and six-hour repository sync scheduled")
}
