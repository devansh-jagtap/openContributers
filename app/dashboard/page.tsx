import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import RepoSearch from "@/components/RepoSearch"
import MySubscriptions from "@/components/MySubscriptions"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
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

        <MySubscriptions />
        <RepoSearch />
      </div>
    </div>
  )
}