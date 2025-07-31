import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required")
}

export const sql = neon(process.env.DATABASE_URL)

export interface User {
  id: string
  phone_number: string
  name?: string
  created_at: string
}

export interface Appointment {
  id: string
  user_id: string
  date: string
  time: string
  note?: string
  status: string
  created_at: string
  user_name?: string
}

export interface OTPCode {
  id: string
  phone_number: string
  code: string
  expires_at: string
  used: boolean
  created_at: string
}
