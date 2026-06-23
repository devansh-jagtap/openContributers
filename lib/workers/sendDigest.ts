import { Worker, Job } from "bullmq";
import { digestQueue, redisConnection } from "@/lib/queue";
import {
  findDueDigestUsers,
  localDateKey,
  sendDigestToUser,
  sendEmailConfirmation,
} from "@/lib/jobs/digest";

async function processJob(job: Job) {
  if (job.name === "dispatch-due-digests") {
    return dispatchDueDigestJobs();
  }
  if (job.name === "send-digest" && job.data.userId) {
    return sendDigestToUser(job.data.userId);
  }
  if (job.name === "send-email-confirmation" && job.data.userId) {
    return sendEmailConfirmation(job.data.userId);
  }
  // A pending job from the retired global scheduler must not bypass each
  // user's newly selected delivery time.
  if (job.name === "dispatch-digest") return;
  console.warn(`[sendDigest] Unknown job name: ${job.name}`);
}

async function dispatchDueDigestJobs() {
  const now = new Date();
  const users = await findDueDigestUsers(now, 100);

  if (users.length === 0) return { queued: 0 };

  await digestQueue.addBulk(
    users.map((user) => ({
      name: "send-digest",
      data: { userId: user.id },
      opts: {
        jobId: `send-digest-${user.id}-${localDateKey(now, user.timezone)}`,
      },
    }))
  );

  console.log(`[sendDigest] Queued ${users.length} due digest job(s)`);
  return { queued: users.length };
}

export function startSendDigestWorker() {
  const worker = new Worker("send-digest", processJob, {
    connection: redisConnection,
  });

  worker.on("completed", (job) =>
    console.log(`[sendDigest] Job ${job.id} (${job.name}) completed`)
  );
  worker.on("failed", (job, err) =>
    console.error(`[sendDigest] Job ${job?.id} (${job?.name}) failed:`, err.message)
  );

  return worker;
}
