import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-in-production")

export async function createToken(phoneNumber: string) {
  return await new SignJWT({ phoneNumber }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("7d").sign(secret)
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as { phoneNumber: string }
  } catch {
    return null
  }
}

export async function getAuthUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) return null

  return await verifyToken(token)
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function isValidPhoneNumber(phone: string): boolean {
  // Validate for Netherlands 06xxxxxxxx format
  const nlPhoneRegex = /^06\d{8}$/
  return nlPhoneRegex.test(phone)
}

export function formatPhoneNumberForDB(phone: string): string {
  // Prepend +31 to the 06xxxxxxxx format for database storage and SMS sending
  if (phone.startsWith("06")) {
    return `+31${phone.substring(1)}`
  }
  return phone // Return as is if it's already in international format
}
