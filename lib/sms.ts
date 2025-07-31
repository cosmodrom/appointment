export interface SMSMessage {
  to: string
  message: string
}

export async function sendSMS(to: string, message: string): Promise<boolean> {
  try {
    // This endpoint should be configured to hit your Android SMS gateway
    const response = await fetch("/api/gateway-sms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to, message }),
    })

    return response.ok
  } catch (error) {
    console.error("Failed to send SMS:", error)
    return false
  }
}

export function formatAppointmentSMS(name: string, date: string, time: string): string {
  return `Hi ${name}, you have a dental appointment on ${date} at ${time}. Please confirm or call if you need to reschedule.`
}

export function formatOTPSMS(code: string): string {
  return `Your appointment system verification code is: ${code}. This code expires in 10 minutes.`
}
