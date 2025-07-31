import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { generateOTP, isValidPhoneNumber, formatPhoneNumberForDB } from "@/lib/auth"
import { sendSMS, formatOTPSMS } from "@/lib/sms"

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber: rawPhoneNumber } = await request.json()

    if (!rawPhoneNumber || !isValidPhoneNumber(rawPhoneNumber)) {
      return NextResponse.json({ error: "Valid phone number (e.g., 0612345678) is required" }, { status: 400 })
    }

    const phoneNumber = formatPhoneNumberForDB(rawPhoneNumber)

    // Generate OTP
    const code = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store OTP in database
    await sql`
      INSERT INTO otp_codes (phone_number, code, expires_at)
      VALUES (${phoneNumber}, ${code}, ${expiresAt.toISOString()})
    `

    // Send SMS
    const message = formatOTPSMS(code)
    const smsSent = await sendSMS(phoneNumber, message)

    if (!smsSent) {
      return NextResponse.json({ error: "Failed to send SMS" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    })
  } catch (error) {
    console.error("Send OTP error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
