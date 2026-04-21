import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8 flex items-center gap-4">
          {session.user?.image && (
            <img
              src={session.user.image}
              alt="avatar"
              className="w-14 h-14 rounded-full"
            />
          )}
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Welcome, {session.user?.name}! 👋
            </h1>
            <p className="text-gray-500 text-sm">{session.user?.email}</p>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Step 3 complete ✅
          </h2>
          <p className="text-gray-500">
            GitHub OAuth is working. Your account is saved in the database.
            Next up — search and subscribe to repos.
          </p>
        </div>
      </div>
    </div>
  )
}