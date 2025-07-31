import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { sendSMS, formatAppointmentSMS } from "@/lib/sms"
import { formatPhoneNumberForDB } from "@/lib/auth"

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
    const appointments = await sql`
      SELECT a.*, u.name as user_name, u.phone_number
      FROM appointments a
      JOIN users u ON a.user_id = u.id
      ORDER BY a.date ASC, a.time ASC
    `

    return NextResponse.json({ appointments })
  } catch (error) {
    console.error("Get admin appointments error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { phoneNumber: rawPhoneNumber, name, date, time, note } = await request.json()

    if (!rawPhoneNumber || !date || !time) {
      return NextResponse.json({ error: "Phone number, date, and time are required" }, { status: 400 })
    }

    const phoneNumber = formatPhoneNumberForDB(rawPhoneNumber)

    // Create or get user
    let user = await sql`
      SELECT * FROM users WHERE phone_number = ${phoneNumber}
    `

    if (user.length === 0) {
      user = await sql`
        INSERT INTO users (phone_number, name) 
        VALUES (${phoneNumber}, ${name || ""}) 
        RETURNING *
      `
    } else if (name && user[0].name !== name) {
      await sql`
        UPDATE users SET name = ${name} WHERE id = ${user[0].id}
      `
    }

    // Create appointment
    const appointment = await sql`
      INSERT INTO appointments (user_id, date, time, note)
      VALUES (${user[0].id}, ${date}, ${time}, ${note || ""})
      RETURNING *
    `

    // Send SMS notification
    const userName = name || "Patient"
    const message = formatAppointmentSMS(userName, date, time)
    await sendSMS(phoneNumber, message)

    return NextResponse.json({
      success: true,
      appointment: appointment[0],
    })
  } catch (error) {
    console.error("Create appointment error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
