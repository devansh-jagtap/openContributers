import { Worker } from "bullmq";
import { redisConnection } from "@/lib/queue";
import { prisma } from "@/lib/prisma";

export function startSyncWorker() {
  const worker = new Worker(
    "sync-repo",
    async (job) => {
      const { repoId, owner, name, githubToken } = job.data;

      console.log(`Syncing issues for ${owner}/${name}...`);

      const headers: Record<string, string> = {
        Accept: "application/vnd.github.v3+json",
      };
      if (githubToken) {
        headers["Authorization"] = `Bearer ${githubToken}`;
      }

      const url = `https://api.github.com/repos/${owner}/${name}/issues?state=open&per_page=100`;
      let response = await fetch(url, { headers });

      if (response.status === 401) {
        console.log("Token invalid, retrying without auth...");
        response = await fetch(url, {
          headers: { Accept: "application/vnd.github.v3+json" },
        });
      }

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      const issues = await response.json();

      console.log(`Found ${issues.length} open issues for ${owner}/${name}`);

      for (const issue of issues) {
        if (issue.pull_request) continue;

        await prisma.issue.upsert({
          where: {
            repoId_githubNumber: {
              repoId,
              githubNumber: issue.number,
            },
          },
          update: {
            title: issue.title,
            body: issue.body,
            state: issue.state,
            labels: issue.labels.map((l: any) => l.name),
          },
          create: {
            repoId,
            githubNumber: issue.number,
            title: issue.title,
            body: issue.body ?? "",
            url: issue.html_url,
            state: issue.state,
            labels: issue.labels.map((l: any) => l.name),
            githubCreatedAt: new Date(issue.created_at),
          },
        });
      }

      await prisma.repo.update({
        where: { id: repoId },
        data: { lastSyncedAt: new Date() },
      });

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
