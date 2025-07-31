"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Calendar, Shield } from "lucide-react"

export function HowItWorksDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-transparent">
          how it works?
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>How It Works</DialogTitle>
          <DialogDescription className="">Simple, secure, and direct communication and file records</DialogDescription>
        </DialogHeader>
        <div className="space-y-8 py-0">
          {/* How It Works Section */}
          <section>
            <div className="text-center mb-8"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle>SMS Authentication</CardTitle>
                  <CardDescription>
                    Enter your phone number and receive a secure verification code via SMS
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle>View Appointments</CardTitle>
                  <CardDescription>Access your upcoming and past appointments with included notes</CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle>Secure & Private</CardTitle>
                  <CardDescription>All messages come directly from your appointer's phone number</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}
