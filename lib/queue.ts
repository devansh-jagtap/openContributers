import { Queue } from "bullmq"
import IORedis from "ioredis"

export const redisConnection = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
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
});

/**
 * Schedule the daily digest for every active user.
 * Call this once at app startup (in your worker bootstrap file).
 */
export async function scheduleDailyDigest() {
  // Remove any existing scheduler first to avoid duplicates on restart
  await digestQueue.removeJobScheduler("daily-digest");

  // Create or update a scheduler that enqueues the "dispatch" job daily
  await digestQueue.upsertJobScheduler(
    "daily-digest",
    {
      pattern: "0 3 * * *", // 8:00 AM UTC every day
    },
    {
      name: "dispatch-digest",
      data: {},
    }
  );

  console.log("[queue] Daily digest scheduled at 03:00 UTC");
}