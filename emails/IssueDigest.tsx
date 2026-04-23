import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export interface IssueDigestProps {
  userName: string;
  repoFullName: string;
  issueNumber: number;
  issueTitle: string;
  issueBody: string | null;
  issueUrl: string;
  labels: string[];
}

export default function IssueDigest({
  userName = "contributor",
  repoFullName = "owner/repo",
  issueNumber = 1,
  issueTitle = "Example issue title",
  issueBody = null,
  issueUrl = "https://github.com",
  labels = [],
}: IssueDigestProps) {
  const preview = `Your daily issue from ${repoFullName}: #${issueNumber} ${issueTitle}`;

  // Trim body so emails don't get huge
  const bodyPreview =
    issueBody && issueBody.length > 400
      ? issueBody.slice(0, 400) + "…"
      : issueBody;

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logo}>opencontributers</Text>
            <Text style={tagline}>Your daily open source issue</Text>
          </Section>

          {/* Greeting */}
          <Section style={content}>
            <Text style={greeting}>Hey {userName} 👋</Text>
            <Text style={body}>
              Here's your issue for today from{" "}
              <Link href={`https://github.com/${repoFullName}`} style={link}>
                {repoFullName}
              </Link>
              . You don't have to fix it — just move it forward a little.
            </Text>
          </Section>

          {/* Issue card */}
          <Section style={issueCard}>
            <Text style={issueRepo}>{repoFullName}</Text>
            <Text style={issueTitle_}>
              #{issueNumber} — {issueTitle}
            </Text>

            {labels.length > 0 && (
              <Section style={labelRow}>
                {labels.slice(0, 4).map((label) => (
                  <Text key={label} style={labelBadge}>
                    {label}
                  </Text>
                ))}
              </Section>
            )}

            {bodyPreview && (
              <Text style={issueBodyText}>{bodyPreview}</Text>
            )}

            <Button style={button} href={issueUrl}>
              View Issue on GitHub →
            </Button>
          </Section>

          {/* What to do */}
          <Section style={content}>
            <Text style={sectionHeading}>What can you do?</Text>
            <Text style={body}>
              • Reproduce the bug and confirm it exists
              <br />
              • Ask the reporter for a clearer example
              <br />
              • Point out if it's a duplicate
              <br />• Leave a comment — even "+1, this is valid" helps
              maintainers
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              You're receiving this because you subscribed to{" "}
              <strong>{repoFullName}</strong> on opencontributers.
            </Text>
            <Text style={footerText}>
              <Link href="{{unsubscribe_url}}" style={footerLink}>
                Unsubscribe from this repo
              </Link>{" "}
              ·{" "}
              <Link href="{{manage_url}}" style={footerLink}>
                Manage subscriptions
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────

const main: React.CSSProperties = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container: React.CSSProperties = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "20px 0 48px",
};

const header: React.CSSProperties = {
  backgroundColor: "#18181b",
  borderRadius: "8px 8px 0 0",
  padding: "24px 32px",
  textAlign: "center",
};

const logo: React.CSSProperties = {
  color: "#ffffff",
  fontSize: "22px",
  fontWeight: "700",
  margin: "0 0 4px",
};

const tagline: React.CSSProperties = {
  color: "#a1a1aa",
  fontSize: "13px",
  margin: "0",
};

const content: React.CSSProperties = {
  backgroundColor: "#ffffff",
  padding: "24px 32px",
};

const greeting: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#18181b",
  margin: "0 0 8px",
};

const body: React.CSSProperties = {
  fontSize: "15px",
  color: "#3f3f46",
  lineHeight: "1.6",
  margin: "0",
};

const issueCard: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid #e4e4e7",
  borderRadius: "8px",
  margin: "0 16px",
  padding: "24px",
};

const issueRepo: React.CSSProperties = {
  fontSize: "12px",
  color: "#71717a",
  fontWeight: "500",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  margin: "0 0 8px",
};

const issueTitle_: React.CSSProperties = {
  fontSize: "17px",
  fontWeight: "700",
  color: "#18181b",
  margin: "0 0 12px",
  lineHeight: "1.4",
};

const labelRow: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "6px",
  margin: "0 0 16px",
};

const labelBadge: React.CSSProperties = {
  display: "inline-block",
  backgroundColor: "#f4f4f5",
  color: "#52525b",
  fontSize: "11px",
  fontWeight: "500",
  padding: "2px 8px",
  borderRadius: "999px",
  margin: "0 4px 4px 0",
};

const issueBodyText: React.CSSProperties = {
  fontSize: "14px",
  color: "#52525b",
  lineHeight: "1.6",
  margin: "0 0 20px",
  whiteSpace: "pre-wrap",
};

const button: React.CSSProperties = {
  backgroundColor: "#18181b",
  color: "#ffffff",
  borderRadius: "6px",
  fontSize: "14px",
  fontWeight: "600",
  padding: "10px 20px",
  textDecoration: "none",
  display: "inline-block",
};

const sectionHeading: React.CSSProperties = {
  fontSize: "15px",
  fontWeight: "600",
  color: "#18181b",
  margin: "0 0 8px",
};

const divider: React.CSSProperties = {
  borderColor: "#e4e4e7",
  margin: "0",
};

const footer: React.CSSProperties = {
  backgroundColor: "#f4f4f5",
  borderRadius: "0 0 8px 8px",
  padding: "20px 32px",
  textAlign: "center",
};

const footerText: React.CSSProperties = {
  fontSize: "12px",
  color: "#71717a",
  margin: "0 0 8px",
};

const footerLink: React.CSSProperties = {
  color: "#71717a",
  textDecoration: "underline",
};

const link: React.CSSProperties = {
  color: "#2563eb",
};