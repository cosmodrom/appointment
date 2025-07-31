import { type NextRequest, NextResponse } from "next/server"

// Simple admin authentication - in production, use proper admin auth
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "admin123"

function isAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization")
  return authHeader === `Bearer ${ADMIN_TOKEN}`
}

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // These environment variables are NOT prefixed with NEXT_PUBLIC_
    // and are therefore only available on the server.
    const apiKey = process.env.TEXTBEE_API_KEY || ""
    const deviceId = process.env.TEXTBEE_DEVICE_ID || ""
    const webhookEndpoint = process.env.TEXTBEE_WEBHOOK_ENDPOINT || ""
    const signingSecret = process.env.TEXTBEE_SIGNING_SECRET || ""

    return NextResponse.json({
      apiKey,
      deviceId,
      webhookEndpoint,
      signingSecret,
    })
  } catch (error) {
    console.error("Failed to fetch TextBee settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
