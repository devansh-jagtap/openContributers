-- Delivery preferences and explicit email confirmation for GitHub OAuth users.
ALTER TABLE "User"
ADD COLUMN "emailConfirmedAt" TIMESTAMP(3),
ADD COLUMN "emailConfirmationToken" TEXT,
ADD COLUMN "emailConfirmationExpires" TIMESTAMP(3),
ADD COLUMN "timezone" TEXT NOT NULL DEFAULT 'UTC',
ADD COLUMN "preferredSendTime" TEXT NOT NULL DEFAULT '09:00',
ADD COLUMN "lastDigestSentAt" TIMESTAMP(3);

CREATE UNIQUE INDEX "User_emailConfirmationToken_key"
  ON "User"("emailConfirmationToken");

CREATE UNIQUE INDEX "EmailLog_userId_issueId_key"
  ON "EmailLog"("userId", "issueId");
