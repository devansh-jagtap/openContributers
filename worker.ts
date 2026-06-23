import "dotenv/config"
import { startSyncWorker } from "./lib/workers/syncRepo"
import { startSendDigestWorker } from "./lib/workers/sendDigest"
import { scheduleWorkerJobs } from "./lib/queue"
import { ensureActiveUserDigestSchedules } from "./lib/scheduler"

async function main() {
  console.log("[worker] Starting workers...")

  startSyncWorker()
  startSendDigestWorker()
  await scheduleWorkerJobs()
  await ensureActiveUserDigestSchedules()

  console.log("[worker] All workers running ✓")
}

main().catch((error) => {
  console.error("[worker] Startup failed:", error)
  process.exit(1)
})

process.on("SIGTERM", () => {
  console.log("[worker] Shutting down gracefully...")
  process.exit(0)
})
