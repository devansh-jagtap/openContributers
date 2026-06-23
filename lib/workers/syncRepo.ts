import { Worker } from "bullmq";
import { redisConnection } from "@/lib/queue";
import { prisma } from "@/lib/prisma";
import { syncRepository } from "@/lib/jobs/syncRepo";

export function startSyncWorker() {
  const worker = new Worker(
    "sync-repo",
    async (job) => {
      if (job.name === "dispatch-repo-sync") {
        return dispatchRepositorySync();
      }

      const { repoId, owner, name, githubToken } = job.data;

      if (!repoId || !owner || !name) {
        throw new Error("sync-repo job is missing repository data");
      }

      console.log(`Syncing issues for ${owner}/${name}...`);
      await syncRepository({ repoId, owner, name, githubToken });

      console.log(`Sync complete for ${owner}/${name}`);
    },
    { connection: redisConnection },
  );

  worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed:`, err.message);
  });

  return worker;
}

/** Refresh all followed repositories every six hours using a subscriber token. */
async function dispatchRepositorySync() {
  const { syncQueue } = await import("@/lib/queue");
  const repos = await prisma.repo.findMany({
    where: { subscriptions: { some: { active: true } } },
    include: {
      subscriptions: {
        where: { active: true },
        include: {
          user: {
            include: {
              accounts: {
                where: { provider: "github" },
                select: { access_token: true },
                take: 1,
              },
            },
          },
        },
        take: 1,
      },
    },
  });

  await Promise.all(
    repos.map((repo) =>
      syncQueue.add("sync-repo", {
        repoId: repo.id,
        owner: repo.owner,
        name: repo.name,
        githubToken: repo.subscriptions[0]?.user.accounts[0]?.access_token ?? null,
      })
    )
  );

  console.log(`[syncRepo] Queued a six-hour refresh for ${repos.length} repositories`);
}
