import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("Missing RESEND_API_KEY environment variable");
}

export const resend = new Resend(process.env.RESEND_API_KEY);

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

type EmailInput = Parameters<typeof resend.emails.send>[0];

/** Resend can return failures rather than throw them. */
export async function sendEmail(input: EmailInput) {
  const { data, error } = await resend.emails.send(input);

  if (error) {
    throw new Error(`Resend rejected the email: ${error.message}`);
  }

  if (!data?.id) {
    throw new Error("Resend did not return an email ID");
  }

  return data;
}
