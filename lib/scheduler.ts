/** Kept as a startup hook. Digest timing is now DB-driven by one BullMQ scheduler. */
export async function ensureActiveUserDigestSchedules() {
  console.log("[queue] User digest schedules are handled by the dispatcher")
}
