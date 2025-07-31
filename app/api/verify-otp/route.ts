import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { createToken, isValidPhoneNumber, formatPhoneNumberForDB } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber: rawPhoneNumber, code } = await request.json()

    if (!rawPhoneNumber || !code || !isValidPhoneNumber(rawPhoneNumber)) {
      return NextResponse.json({ error: "Phone number and code are required" }, { status: 400 })
    }

    const phoneNumber = formatPhoneNumberForDB(rawPhoneNumber)

    // Verify OTP
    const otpResult = await sql`
      SELECT * FROM otp_codes 
      WHERE phone_number = ${phoneNumber} 
        AND code = ${code} 
        AND used = FALSE 
        AND expires_at > NOW()
      ORDER BY created_at DESC 
      LIMIT 1
    `

    if (otpResult.length === 0) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 })
    }

    // Mark OTP as used
    await sql`
      UPDATE otp_codes 
      SET used = TRUE 
      WHERE id = ${otpResult[0].id}
    `

    // Create or get user
    let user = await sql`
      SELECT * FROM users WHERE phone_number = ${phoneNumber}
    `

    if (user.length === 0) {
      user = await sql`
        INSERT INTO users (phone_number) 
        VALUES (${phoneNumber}) 
        RETURNING *
      `
    }

    // Create JWT token
    const token = await createToken(phoneNumber)

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return NextResponse.json({
      success: true,
      user: user[0],
      message: "Authentication successful",
    })
  } catch (error) {
    console.error("Verify OTP error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
