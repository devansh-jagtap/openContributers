import { startSyncWorker } from "@/lib/workers/syncRepo"

let workerStarted = false

export async function GET() {
  if (!workerStarted) {
    startSyncWorker()
    workerStarted = true
    return Response.json({ message: "Worker started" })
  }
  return Response.json({ message: "Worker already running" })
}