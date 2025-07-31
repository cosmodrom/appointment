import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { to, message } = await request.json()

    if (!to || !message) {
      return NextResponse.json({ error: "Phone number and message are required" }, { status: 400 })
    }

    const textBeeApiKey = process.env.TEXTBEE_API_KEY
    const textBeeDeviceId = process.env.TEXTBEE_DEVICE_ID

    if (!textBeeApiKey || !textBeeDeviceId) {
      console.warn("TextBee API Key or Device ID not configured. SMS will only be logged.")
      console.log(`📱 SMS to ${to}: ${message}`)
      return NextResponse.json({
        success: true,
        message: "SMS logged (TextBee not fully configured)",
      })
    }

    try {
      const response = await fetch("https://api.textbee.dev/v1/sms/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${textBeeApiKey}`,
        },
        body: JSON.stringify({
          device_id: textBeeDeviceId,
          phone_number: to,
          message: message,
        }),
      })

      if (!response.ok) {
        let errorDetails = "Unknown error"
        try {
          const errorData = await response.json()
          errorDetails = JSON.stringify(errorData)
        } catch (jsonError) {
          errorDetails = `Could not parse error response: ${response.status} ${response.statusText}`
        }
        console.error("TextBee API non-OK response:", response.status, response.statusText, errorDetails)
        throw new Error(`TextBee responded with status: ${response.status} - ${errorDetails}`)
      }

      const responseData = await response.json()
      console.log("TextBee SMS sent successfully:", responseData)

      return NextResponse.json({
        success: true,
        message: "SMS sent via TextBee",
      })
    } catch (error) {
      // Log the full error object for better diagnostics
      console.error("TextBee API call failed (network/fetch error):", error)
      // Also log the error stack if available
      if (error instanceof Error && error.stack) {
        console.error("Error stack:", error.stack)
      }
      return NextResponse.json(
        { error: `Failed to send SMS via TextBee: ${error instanceof Error ? error.message : String(error)}` },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("SMS Gateway request processing error:", error)
    return NextResponse.json({ error: "Failed to process SMS request" }, { status: 500 })
  }
}
