import GithubProvider from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import type { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "database",
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email public_repo",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        const account = await prisma.account.findFirst({
          where: { userId: user.id, provider: "github" },
        })
        session.user.githubToken = account?.access_token ?? null
      }
      return session
    },
  },
  events: {
    async createUser({ user }) {
      // OAuth proves GitHub identity, but a direct confirmation makes sure the
      // inbox can receive scheduled product email.
      if (!user.email) return

      try {
        const { queueEmailConfirmation } = await import("@/lib/emailConfirmation")
        await queueEmailConfirmation(user.id)
      } catch (error) {
        console.error("[auth] Could not send email confirmation:", error)
      }
    },
  },
  pages: {
    signIn: "/login",
  },
}
