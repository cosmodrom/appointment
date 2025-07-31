import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getAuthUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser()
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const appointments = await sql`
      SELECT a.*, u.name as user_name
      FROM appointments a
      JOIN users u ON a.user_id = u.id
      WHERE u.phone_number = ${authUser.phoneNumber}
      ORDER BY a.date ASC, a.time ASC
    `

    return NextResponse.json({ appointments })
  } catch (error) {
    console.error("Get appointments error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
