import { Worker, Job } from "bullmq";
import { redisConnection } from "@/lib/queue";
import { prisma } from "@/lib/prisma";
import { resend, FROM_EMAIL } from "@/lib/mailer";
import { render } from "@react-email/components";
import IssueDigest from "@/emails/IssueDigest";

async function processJob(job: Job) {
  // "dispatch-digest" fans out one job per user
  // "send-digest" handles a single user
  if (job.name === "dispatch-digest") {
    return dispatchDigest();
  }
  if (job.name === "send-digest" && job.data.userId) {
    return sendDigestToUser(job.data.userId);
  }
  console.warn(`[sendDigest] Unknown job name: ${job.name}`);
}

// Fired by the scheduler — enqueues one "send-digest" job per active user
async function dispatchDigest() {
  const { digestQueue } = await import("@/lib/queue");

  const users = await prisma.user.findMany({
    where: {
      email: { not: null },
      subscriptions: { some: { active: true } },
    },
    select: { id: true },
  });

  console.log(`[dispatchDigest] Dispatching digest to ${users.length} users`);

  for (const user of users) {
    await digestQueue.add("send-digest", { userId: user.id });
  }
}

// Handles one user — picks unsent issues and emails them
async function sendDigestToUser(userId: string) {
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
  });

  if (!user?.email) {
    console.log(`[sendDigest] Skipping ${userId} — no email address`);
    return;
  }

  const sentIssueIds = new Set(user.emailLogs.map((log) => log.issueId));

  for (const subscription of user.subscriptions) {
    const { repo, issuesPerDay } = subscription;

    const unsentIssues = repo.issues.filter(
      (issue) => !sentIssueIds.has(issue.id)
    );

    if (unsentIssues.length === 0) {
      console.log(`[sendDigest] No unsent issues for ${repo.fullName} → ${user.email}`);
      continue;
    }

    const batch = unsentIssues.slice(0, issuesPerDay);

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
          })
        );

        await resend.emails.send({
          from: FROM_EMAIL,
          to: user.email!,
          subject: `[${repo.fullName}] #${issue.githubNumber} — ${issue.title}`,
          html,
        });

        await prisma.emailLog.create({
          data: { userId: user.id, issueId: issue.id },
        });

        sentIssueIds.add(issue.id); // prevent double-send within same run

        console.log(
          `[sendDigest] ✓ Sent #${issue.githubNumber} from ${repo.fullName} → ${user.email}`
        );
      } catch (err) {
        // Log and continue — don't let one failure block the rest
        console.error(
          `[sendDigest] ✗ Failed issue ${issue.id} → ${user.email}:`,
          err
        );
      }
    }
  }
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