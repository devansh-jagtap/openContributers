import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { startSyncWorker } from "./lib/workers/syncRepo"
import { startSendDigestWorker } from "./lib/workers/sendDigest"
import { scheduleDailyDigest } from "./lib/queue"

console.log("[worker] Starting workers...")

startSyncWorker()
startSendDigestWorker()
scheduleDailyDigest()

console.log("[worker] All workers running ✓")

process.on("SIGTERM", () => {
  console.log("[worker] Shutting down gracefully...")
  process.exit(0)
})