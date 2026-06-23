"use client"

import { useEffect, useState } from "react"

type Preferences = {
  email: string | null
  emailConfirmedAt: string | null
  preferredSendTime: string
  timezone: string
}

export default function EmailPreferences() {
  const [preferences, setPreferences] = useState<Preferences | null>(null)
  const [saving, setSaving] = useState(false)
  const [resending, setResending] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetch("/api/preferences")
      .then((response) => response.json())
      .then((data) => {
        if (data.user) setPreferences(data.user)
      })
      .catch(() => setMessage("Could not load email preferences."))
  }, [])

  async function savePreferences() {
    if (!preferences) return
    setSaving(true)
    setMessage("")

    const response = await fetch("/api/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        preferredSendTime: preferences.preferredSendTime,
        timezone: preferences.timezone,
      }),
    })
    const data = await response.json()
    setSaving(false)

    if (!response.ok) {
      setMessage(data.error ?? "Could not save email preferences.")
      return
    }
    setPreferences((current) => (current ? { ...current, ...data.user } : current))
    setMessage("Saved. Future digests will follow this local time.")
  }

  async function resendConfirmation() {
    setResending(true)
    setMessage("")
    const response = await fetch("/api/email/confirmation", { method: "POST" })
    const data = await response.json()
    setResending(false)
    setMessage(response.ok ? data.message : (data.error ?? "Could not queue the email."))
  }

  if (!preferences) {
    return <div className="rounded-2xl border border-zinc-200/80 bg-white/90 p-6 text-sm text-zinc-500 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">Loading email preferences…</div>
  }

  return (
    <section className="rounded-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] dark:border-zinc-800/80 dark:bg-zinc-900/90 sm:p-7">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">Email delivery</p>
      <h2 className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Choose when your digest arrives</h2>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Times follow your selected timezone, including daylight-saving changes.</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Local time
          <input
            type="time"
            step="60"
            value={preferences.preferredSendTime}
            onChange={(event) => setPreferences({ ...preferences, preferredSendTime: event.target.value })}
            className="mt-1.5 block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </label>
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Timezone
          <input
            value={preferences.timezone}
            onChange={(event) => setPreferences({ ...preferences, timezone: event.target.value })}
            placeholder="Asia/Kolkata"
            className="mt-1.5 block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button onClick={savePreferences} disabled={saving} className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900">
          {saving ? "Saving…" : "Save delivery time"}
        </button>
        {preferences.emailConfirmedAt ? (
          <span className="text-sm text-emerald-600 dark:text-emerald-400">✓ {preferences.email} is confirmed</span>
        ) : (
          <button onClick={resendConfirmation} disabled={resending} className="text-sm font-medium text-zinc-700 underline underline-offset-2 disabled:opacity-50 dark:text-zinc-300">
            {resending ? "Sending…" : "Resend confirmation email"}
          </button>
        )}
      </div>
      {message && <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">{message}</p>}
    </section>
  )
}
