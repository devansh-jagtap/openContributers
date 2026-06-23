import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text } from "@react-email/components"

export default function EmailConfirmation({
  userName,
  confirmationUrl,
}: {
  userName: string
  confirmationUrl: string
}) {
  return (
    <Html>
      <Head />
      <Preview>Confirm your OpenContributers email</Preview>
      <Body style={{ backgroundColor: "#f4f4f5", fontFamily: "Arial, sans-serif" }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto", padding: "32px 20px" }}>
          <Section style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "32px" }}>
            <Heading style={{ color: "#18181b", marginTop: 0 }}>Welcome to OpenContributers</Heading>
            <Text style={{ color: "#3f3f46", lineHeight: "1.6" }}>
              Hey {userName}, confirm this email address to start receiving your chosen GitHub issue digest.
            </Text>
            <Button href={confirmationUrl} style={{ backgroundColor: "#18181b", borderRadius: "6px", color: "#ffffff", padding: "12px 18px", textDecoration: "none" }}>
              Confirm my email
            </Button>
            <Text style={{ color: "#71717a", fontSize: "12px", lineHeight: "1.5" }}>
              This link expires in 24 hours. If you did not create an account, you can safely ignore this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
