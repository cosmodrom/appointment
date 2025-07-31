"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Shield, Loader2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import type React from "react"
import { HowItWorksDialog } from "@/components/how-it-works-dialog"
import { WhyChooseDialog } from "@/components/why-choose-dialog" // Import the new dialog
import { cn } from "@/lib/utils"

export default function HomePage() {
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow only digits and limit to 10 characters
    const filteredValue = value.replace(/\D/g, "").substring(0, 10)

    // Ensure it starts with '0' if not empty
    if (filteredValue.length > 0 && filteredValue[0] !== "0") {
      setPhoneNumber("0" + filteredValue.substring(1))
    } else {
      setPhoneNumber(filteredValue)
    }
  }

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      })

      const data = await response.json()

      if (response.ok) {
        setStep("otp")
        toast({
          title: "OTP Sent",
          description: "Please check your phone for the verification code.",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to send OTP",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, code: otp }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Login successful!",
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "Error",
          description: data.error || "Invalid OTP",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Appointment</h1>
              <p className="text-sm text-gray-600">Direct and Secure System</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <HowItWorksDialog />
            <WhyChooseDialog /> {/* New button for Why Choose Us */}
            <Button asChild variant="outline">
              <Link href="/admin">(8)</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section with Login Form */}
      <section className="px-4 flex items-center min-h-[calc(100vh-180px)] py-0 flex-col text-center justify-start pt-24">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <Card className="transition-all duration-300 focus:outline-none focus:ring-0 focus:border-transparent leading-7 bg-transparent px-7 h-20 text-5xl tracking-tight font-black tabular-nums text-center w-auto opacity-65 text-slate-800 border-transparent shadow-inner">
            <CardHeader className="pb-4 leading-7 text-center">
              <CardTitle className="font-thin text-5xl md:text-6xl leading-tight text-black mb-1.5 text-center shadow-2xl">
                access with <br /> phone #
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {step === "phone" ? (
                <form onSubmit={handleSendOTP} className="space-y-6 w-full">
                  <div className="space-y-2 flex justify-center">
                    <Input
                      id="phone"
                      type="tel" // Changed to text to better control input
                      placeholder="0612345678"
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                      maxLength={10} // Limit input length
                      required
                      className="transition-all duration-300 focus:outline-none focus:ring-0 focus:border-transparent leading-7 px-7 text-5xl tracking-tight tabular-nums border-transparent shadow-innererer h-24 border-0 text-lime-600 opacity-80 w-full font-extrabold text-center shadow-2xl" // Removed focus borders
                    />
                  </div>
                  <Button
                    type="submit"
                    className={cn(
                      "w-full text-lg transition-all duration-300 ease-in-out bg-slate-400 h-14 font-light overflow-hidden", // Added overflow-hidden
                      phoneNumber.length === 10
                        ? "opacity-100 scale-100 pointer-events-auto py-4" // Added py-4 for height
                        : "opacity-0 scale-95 pointer-events-none h-0 py-0", // Set h-0 and py-0 for complete invisibility
                    )}
                    disabled={loading || phoneNumber.length !== 10}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Code"
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-6 w-full">
                  <div className="space-y-2">
                    <Input
                      id="otp"
                      type="text"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      required
                      className="text-4xl h-20 px-6 text-center tracking-wider transition-all duration-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <Button type="submit" className="w-full h-14 text-lg" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-5 w-5" />
                        Verify & Login
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="ghost" className="w-full text-base" onClick={() => setStep("phone")}>
                    Back to Phone Number
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Main Content Area - Simplified */}
      <section className="bg-white/50 py-[15px] px-[15px]">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-600 max-w-2xl mx-auto font-light text-base italic">
            SMS-based authentication &amp; appointment management - no third-party services
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Link
            href="https://cosmodrom.eu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-400 hover:underline font-normal"
          >
            .csmdr()m
          </Link>
          <p className="text-xl font-bold mt-1">2025</p>
        </div>
      </footer>
    </div>
  )
}
